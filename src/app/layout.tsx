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
      <body
        className={`${sen.className} antialiased`}
      >
        <div className="max-w-sm mx-auto p-12 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
