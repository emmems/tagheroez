import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { RpcProvider } from "@/src/api/tools/RpcProvider";
import {
    ClerkProvider,
    RedirectToSignIn,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppSidebar } from "./_components/app-sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JumpHeroez App",
  description: "JumpHeroez Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RpcProvider>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>

            <SignedIn>
              <SidebarProvider>
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                  <header className="flex justify-between items-center h-16 border-b px-4">
                    <div className="flex items-center gap-2">
                      <SidebarTrigger className="-ml-1" />
                      <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                      />
                      <p className="font-bold">Adventure Park Mangagment</p>
                    </div>

                    <UserButton />
                  </header>
                  <main className="bg-neutral-50 flex flex-1 flex-col gap-6 p-6">{children}</main>
                </div>
              </SidebarProvider>
            </SignedIn>
          </RpcProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
