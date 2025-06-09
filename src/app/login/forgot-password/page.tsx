"use client";
import { useActionState } from "react";
import { forgotPassword } from "@/app/lib/actions";
import TextInput from "@/app/ui/text-input";
import { nunito_sans } from "@/app/fonts";
import Button from "@/app/ui/button";

export default function ForgotPassword() {
  const initialForgotPasswordState = {
    errors: {
      email: undefined,
    },
    message: undefined,
  };

  const [forgotPasswordState, forgotPasswordAction] = useActionState(forgotPassword, initialForgotPasswordState);

  return (
    <div className="gap-20 flex flex-col justify-center items-center min-h-screen">
      <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Forgot Password</h1>
      <form className="w-full space-y-4" action={forgotPasswordAction}>
        <TextInput name="email" type="text" placeholder="Email" />

        <Button text="Submit" style="regular" type="submit" />
        {forgotPasswordState.message && <p>{forgotPasswordState.message}</p>}
      </form>
    </div>
  );
}