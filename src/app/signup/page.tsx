"use client";
import { useActionState } from "react";
import { signup } from "@/app/lib/actions";
import TextInput from "../ui/text-input";
import { nunito_sans } from "../fonts";
import Button from "../ui/button";

export default function Signup() {

  const initialSignupState = {
    errors: {
      name: undefined,
      email: undefined,
      password: undefined,
    },
    message: undefined,
  };

  const [signupState, signupAction] = useActionState(signup, initialSignupState);

  return (
      <div className="m-4 gap-20 flex flex-col justify-center items-center min-h-screen">
        <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Create an account</h1>
        <form className="w-full space-y-4" action={signupAction}>
          <TextInput name="name" type="text" placeholder="Name" />
          <TextInput name="email" type="email" placeholder="Email" />
          <TextInput name="password" type="password" placeholder="Password" />
          <Button text="Sign Up" style="bold" type="submit" />

          {signupState.message && <p>{signupState.message}</p>}
        </form>
      </div>
  );
}