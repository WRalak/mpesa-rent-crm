import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { SessionProviderWrapper } from "@/components/auth/session-provider";
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
  title: "M-Pesa Rent CRM",
  description: "Rent collection and eRITS compliance for small landlords",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "M-Pesa Rent CRM",
    description: "Rent collection and eRITS compliance for small landlords",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="csrf-token" content={process.env.NEXT_PUBLIC_CSRF_TOKEN || ''} />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <SessionProviderWrapper>
            <ToastProvider>
              {children}
            </ToastProvider>
          </SessionProviderWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
