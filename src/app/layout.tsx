import type { Metadata } from "next"
import { plusJakarta, beVietnam } from "@/lib/fonts"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: "TallyOh — Where every Tally tells a Story",
  description:
    "A financial literacy adventure app for kids ages 4-10. Story-driven learning with 12 characters, real-world missions, and parent-controlled rewards.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${beVietnam.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
