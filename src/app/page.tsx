import { nunito_sans } from "./fonts";
import Button from "./ui/button";

export default function Home() {
  return (
    <main className="gap-20 flex flex-col justify-center items-center min-h-screen">
      <div className="space-y-4">
        <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Chirpy</h1>
        <p className="text-primary-400 text-center">Daily renewal with your self care songbird.</p>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <Button link="/signup" text="Get a new pet" style="bold" />
        <Button link="/login" text="I already have a pet" style="regular" />
      </div>
      
    </main>
  );
}
