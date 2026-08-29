import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AURA — Eleva tu energía personal",
  description: "App que proyecta y eleva tu aura personal en vivo con inteligencia artificial y hábitos diarios.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AURA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0A1A",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (clerkPubKey && clerkPubKey.trim() !== "") {
    return (
      <ClerkProvider publishableKey={clerkPubKey}>
        <html lang="es" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
          <body className="antialiased bg-[#0A0A1A] text-[#F8F8FF] min-h-screen flex flex-col justify-between select-none">
            <main className="flex-1 max-w-md mx-auto w-full min-h-screen flex flex-col relative pb-20 overflow-x-hidden">
              {children}
            </main>
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html lang="es" className={`${outfit.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-[#0A0A1A] text-[#F8F8FF] min-h-screen flex flex-col justify-between select-none">
        <main className="flex-1 max-w-md mx-auto w-full min-h-screen flex flex-col relative pb-20 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
