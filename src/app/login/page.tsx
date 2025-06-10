"use client";
import { useActionState } from "react";
import { login } from "@/app/lib/actions";
import Link from "next/link";
import { nunito_sans } from "../fonts";
import TextInput from "../ui/text-input";
import Button from "../ui/button";

export default function Login() {

  const initialLoginState = {
    errors: {
      email: undefined,
      password: undefined,
    },
    message: undefined,
  };

  const [loginState, loginAction] = useActionState(login, initialLoginState);

  return (
    <div className="gap-20 flex flex-col w-full">
      <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Login</h1>
      <form className="w-full space-y-4" action={loginAction}>
        <TextInput name="email" type="text" placeholder="Email" />
        <TextInput name="password" type="password" placeholder="Password" />
        
        <Button text="Login" style="bold" type="submit" />
        {loginState.message && <p>{loginState.message}</p>}
      </form>
      <Link
        href="/login/forgot-password"
      >
        <p>I forgot my password.</p>
      </Link>
    </div>
      
  );
}