import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthContextProvider } from "./services/authservice";
import NextUICompProvider from "./providers/NextUiProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MRP",
  description: "Zero One Forge - MRP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextUICompProvider>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
          </NextUICompProvider>
        </body>
      </AuthContextProvider>
    </html>
  );
}
