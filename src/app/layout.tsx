import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/nav";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const APP_URL = "https://learnvocabulary-tau.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Learn Vocabulary",
    template: "%s | Learn Vocabulary",
  },
  description:
    "Build your vocabulary with flashcards, audio pronunciation, and daily streaks. Add words, practice with IPA audio, and track your progress.",
  keywords: ["vocabulary", "flashcards", "english", "learning", "IPA", "pronunciation"],
  authors: [{ name: "Learn Vocabulary" }],
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "Learn Vocabulary — Personal Vocabulary Trainer",
    description:
      "Build your vocabulary with flashcards, audio pronunciation, and daily streaks.",
    siteName: "Learn Vocabulary",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Vocabulary — Personal Vocabulary Trainer",
    description:
      "Build your vocabulary with flashcards, audio pronunciation, and daily streaks.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <NextTopLoader color="#58cc02" shadow="0 0 10px #58cc02" height={3} showSpinner={false} />
          <Nav user={session?.user} />
          <div className="flex-1">{children}</div>
          <Toaster richColors position="top-center" duration={2000} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
