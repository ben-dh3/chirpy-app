import type { Metadata } from "next";
import { sen } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chirpy",
  description: "Daily renewal with your self care songbird.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${sen.className} antialiased p-12`}
      >
        {children}
      </body>
    </html>
  );
}
