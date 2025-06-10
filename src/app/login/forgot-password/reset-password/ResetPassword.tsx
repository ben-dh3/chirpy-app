"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/lib/actions";
import { nunito_sans } from "@/app/fonts";
import TextInput from "@/app/ui/text-input";
import Button from "@/app/ui/button";

export default function ResetPassword({ code }: { code?: string }) {
  const initialState = {
    errors: {
      password: undefined,
      confirmPassword: undefined,
    },
    message: null,
  };

  const [state, formAction] = useActionState(resetPassword, initialState);

  if (!code) {
    return (
      <div className="m-4 gap-20 flex flex-col">
        <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Reset Password</h1>
        <p>Invalid or missing reset code.</p>
      </div>
    );
  }

  return (
    <div className="m-4 gap-20 flex flex-col">
      <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Reset Password</h1>
      <form className="w-full space-y-4" action={formAction}>
        <input type="hidden" name="code" value={code} />
        <TextInput name="password" type="password" placeholder="New Password" />
        {state.errors?.password && <p>{state.errors.password[0]}</p>}
    
        <TextInput name="confirmPassword" type="password" placeholder="Confirm Password" />
        {state.errors?.confirmPassword && <p>{state.errors.confirmPassword[0]}</p>}

        <Button text="Reset Password" style="regular" type="submit" />
        {state.message && <p>{state.message}</p>}
      </form>
    </div>
  );
}