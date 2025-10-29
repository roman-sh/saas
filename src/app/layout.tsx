import type { Metadata } from "next"
import "./globals.css"
import {
   ClerkProvider,
   SignInButton,
   SignUpButton,
   SignedIn,
   SignedOut,
   UserButton,
} from "@clerk/nextjs"

export const metadata: Metadata = {
   title: "Business Idea Generator",
   description: "AI-powered business idea generation",
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <ClerkProvider>
         <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
         </html>
      </ClerkProvider>
   )
}
