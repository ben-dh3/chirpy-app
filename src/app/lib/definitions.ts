import { z } from "zod";

export type ActionState<T extends z.ZodType> = {
    errors?: z.inferFlattenedErrors<T>['fieldErrors'] | null;
    message?: string | null;
  };
  
  export const SignupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string()
      .min(6, "Password must be at least 6 characters")
      .refine(
        (password) => /^(?=.*[A-Z])(?=.*\d).+$/.test(password),
        { message: "Password must contain at least one number and one capital letter" }
      ),
  });
  
  export type SignupActionState = ActionState<typeof SignupSchema>;
  
  export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
  });
  
  export type LoginActionState = ActionState<typeof LoginSchema>;
  
  export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address")
  });
  
  export type ForgotPasswordActionState = ActionState<typeof ForgotPasswordSchema>;
  
  export const ResetPasswordSchema = z.object({
    password: z.string()
      .min(6, "Password must be at least 6 characters")
      .refine(
        (password) => /^(?=.*[A-Z])(?=.*\d).+$/.test(password),
        { message: "Password must contain at least one number and one capital letter" }
      ),
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });
  
  export type ResetPasswordActionState = ActionState<typeof ResetPasswordSchema>;

  // Pet

export const PetSchema = z.object({
  stage: z.enum(['egg', 'baby', 'adolescent', 'mature']),
  total_minutes: z.number().min(0),
  daily_minutes: z.number().min(0),
  streak: z.number().min(1),
  last_active: z.string().datetime(),
});

export type PetState = z.infer<typeof PetSchema>;