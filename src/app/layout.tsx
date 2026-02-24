import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthContextProvider } from "./services/authservice";
import NextUICompProvider from "./providers/NextUiProvider";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import AppShell from "../components/AppShell";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seals Forge",
  description: "Seals Forge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.className}`}>
        <AuthContextProvider>
          <NextUICompProvider>
            <ThemeProvider>
              <Toaster position="top-right" reverseOrder={false} />
              <SidebarProvider>
                <AppShell>{children}</AppShell>
              </SidebarProvider>
            </ThemeProvider>
          </NextUICompProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
