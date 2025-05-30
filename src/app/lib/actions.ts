"use server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { 
  ForgotPasswordActionState, 
  LoginActionState, 
  ResetPasswordActionState, 
  ResetPasswordSchema, 
  SignupActionState, 
  SignupSchema 
} from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { canEvolve, getDailyGoal, isMissedDay } from "./utils";

// signup

export async function signup(
  prevState: SignupActionState, 
  formData: FormData
) : Promise<SignupActionState> {
  const supabase = await createClient();

  const validated = SignupSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors ,
      message: null
    };
  }

  const { name, email, password } = validated.data;
  const { error } = await supabase.auth.signUp(
    {
      email, 
      password, 
      options: {
        data: { name },
        emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL + '/login'
      } 
    });

  if (error) return { message: error.message };
  
  return { 
    message: "Signup success. Check your email for confirmation."
  }
}

// login

export async function login(
  prevState: LoginActionState, 
  formData: FormData
) : Promise<LoginActionState> {
  const supabase = await createClient();

  const validated = z.object({ 
    email: z.string().email(), 
    password: z.string().min(6) }).safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors,
      message: null
    };
  }

  const { email, password } = validated.data;
  const { error } = await supabase.auth.signInWithPassword({
    email, 
    password 
  });

  if (error) return { message: "Invalid credentials" };
  redirect("/dashboard");
}

// sign out

export async function logOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut()
    if (error){
      return(
        console.log("Error signing out: ", error)
      )
    }
    redirect("/");
}

// forgot password

export async function forgotPassword(
  prevState: ForgotPasswordActionState, 
  formData: FormData
) : Promise<ForgotPasswordActionState> {
  const supabase = await createClient();

  const validated = z.object({ email: z.string().email() }).safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: null
    };
  }

  const { email } = validated.data;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_APP_URL + '/login/forgot-password/reset-password',
  })
  if (error) return { message: error.message };

  return {
    message: "Check your email for a link to reset your password."
  }
}

// reset password

export async function resetPassword(
  prevState: ResetPasswordActionState, 
  formData: FormData
) : Promise<ResetPasswordActionState> {
  const supabase = await createClient();

  const validated = ResetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!validated.success) {
    return { 
      errors: validated.error.flatten().fieldErrors,
      message: null
    };
  }

  const { password, code } = validated.data;
  
  try{

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      return { 
        errors: null, 
        message: "Invalid or expired reset code." 
      };
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { 
        errors: null, 
        message: error.message 
      };
    }
  } catch {
    return {
      message: "Password reset unsuccessful."
    }
  }
  redirect('/login?message=Password reset successful');
}

// streak and time tracking

export async function updatePetProgress(userId: string, minutes: number) {
  const supabase = await createClient();
  const { data: pet } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", userId)
    .single();

  const now = new Date();
  const todayMidnight = new Date(now.setHours(0, 0, 0, 0)).toISOString();
  const lastActiveDate = pet?.last_active ? new Date(pet.last_active).toISOString().split("T")[0] : todayMidnight;
  const isNewDay = !pet || lastActiveDate < todayMidnight.split("T")[0];

  let newStage = pet?.stage || "egg";
  let newTotal = (pet?.total_minutes || 0) + minutes;
  let newDaily = isNewDay ? minutes : (pet?.daily_minutes || 0) + minutes;
  let newStreak = pet?.streak || 0;

  if (isNewDay && isMissedDay(pet?.last_active)) {
    newStage = "egg";
    newTotal = minutes;
    newDaily = minutes;
    newStreak = 1;
  }

  // streak logic
  const dailyGoal = getDailyGoal(newStage);
  if (isNewDay) {
    newStreak = newDaily >= dailyGoal ? 1 : 0; // start streak if goal met
  } else if (newDaily >= dailyGoal && pet?.daily_minutes < dailyGoal) {
    newStreak = (pet?.streak || 0) + 1; // increment only when goal is completed
  } else {
    newStreak = pet?.streak || 0; // otherwise maintain streak
  }

  const { error } = await supabase.from("pets").upsert({
    user_id: userId,
    stage: newStage,
    total_minutes: newTotal,
    daily_minutes: newDaily,
    streak: newStreak,
    last_active: now.toISOString(),
  });

  if (error) {
    console.error("Error updating pet progress:", error);
    return { success: false };
  }

  revalidatePath("/dashboard");
  return { success: true, goalCompleted: newDaily >= dailyGoal };
}

// pet evolving

export async function evolvePet(userId: string) {
  const supabase = await createClient();

  // find pet linked to user
  const { data: pet } = await supabase
    .from("pets")
    .select("stage, total_minutes")
    .eq("user_id", userId)
    .single();

  let newStage: string;

  // new users get an egg to hatch/evolve initially
  if (!pet) {
    newStage = "egg";
    const { error: upsertError } = await supabase.from("pets").upsert({
      user_id: userId,
      stage: newStage,
      total_minutes: 0,
      daily_minutes: 0,
      streak: 1,
      last_active: new Date().toISOString(),
    });
    if (upsertError) {
      return;
    }
  } else {
    if (!canEvolve(pet.stage, pet.total_minutes)) {
      return;
    }
    newStage =
      pet.stage === "egg" ? "baby" :
      pet.stage === "baby" ? "adolescent" :
      pet.stage === "adolescent" ? "mature" : "mature";
    const { error: updateError } = await supabase
      .from("pets")
      .update({ stage: newStage })
      .eq("user_id", userId);
    if (updateError) {
      return;
    }
  }

  revalidatePath("/dashboard");
}
