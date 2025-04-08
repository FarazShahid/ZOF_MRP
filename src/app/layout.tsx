import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthContextProvider } from "./services/authservice";
import NextUICompProvider from "./providers/NextUiProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";

const outfit = Outfit({
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
        <body className={`${outfit.className} dark:bg-gray-900`}>
          <NextUICompProvider>
            <ThemeProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </NextUICompProvider>
        </body>
      </AuthContextProvider>
    </html>
  );
}
