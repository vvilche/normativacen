import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NormativaCEN | Cumplimiento Normativo Asistido con IA",
  description: "El primer Agente Experto en cumplimiento de la Normativa del Coordinador Eléctrico Nacional.",
};

import { IndustrialBackground } from "@/components/IndustrialBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrains.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-body text-foreground flex flex-col relative" suppressHydrationWarning>
        <IndustrialBackground />
        {children}
      </body>
    </html>
  );
}
