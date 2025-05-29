"use server";
import { cache } from "react";
import { getUserSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isMissedDay } from "./utils";

export const verifySession = cache(async () => {
  const session = await getUserSession();
  if (!session) redirect("/login");
  return { userId: session.userId, name: session.name };
});

export const getUserData = cache(async () => {
  const supabase = await createClient();
  const session = await verifySession();
  const { data } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", session.userId)
    .single();
  return data;
});

// Data Access Layer for Pet Data

export const getPetData = cache(async (userId: string) => {
  const supabase = await createClient();
  // find pet attatched to userid
  const { data } = await supabase.from("pets").select("*").eq("user_id", userId).single();
  // Reset to egg if a day was missed
  if (data && isMissedDay(data.last_active)) {
    await supabase.from("pets").update({
      stage: "egg",
      total_minutes: 0,
      daily_minutes: 0,
      streak: 0,
      last_active: new Date().toISOString(),
    }).eq("user_id", userId);
    return { stage: "egg", total_minutes: 0, daily_minutes: 0, streak: 0, last_active: new Date().toISOString() };
  }

  return data || { stage: "egg", total_minutes: 0, daily_minutes: 0, streak: 0, last_active: new Date().toISOString() };
});

