import { Suspense } from 'react';
import ResetPassword from './ResetPassword';
import { nunito_sans } from '@/app/fonts';

type SearchParams = {
  [key: string]: string | undefined;
};

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const code = params.code;

  return (
    <Suspense fallback={
      <div className="gap-20 flex flex-col justify-center items-center min-h-screen">
        <h1 className={`${nunito_sans.className} text-center text-4xl font-bold antialiased`}>Reset Password</h1>
        <p>Loading...</p>
      </div>
    }>
      <ResetPassword code={typeof code === 'string' ? code : undefined} />
    </Suspense>
  );
}