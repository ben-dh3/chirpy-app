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
        {children}
      </body>
    </html>
  );
}
