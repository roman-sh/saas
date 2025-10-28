import type { Metadata } from "next"
import "./globals.css"


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
      <html lang="en" suppressHydrationWarning>
         <body>{children}</body>
      </html>
   )
}
