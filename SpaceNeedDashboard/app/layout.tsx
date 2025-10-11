import type React from "react"
import type { Metadata } from "next"
import { Libre_Franklin } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const franklinGothic = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Space Planning Dashboard",
  description: "Space Planning Dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${franklinGothic.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
