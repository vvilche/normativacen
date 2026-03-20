import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "NormativaCEN | Cumplimiento Normativo Asistido con IA",
  description: "El primer Agente Experto en cumplimiento de la Normativa del Coordinador Eléctrico Nacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${sourceSans.variable} dark antialiased`}>
      <body className="min-h-screen bg-background font-body text-foreground flex flex-col">
        {children}
      </body>
    </html>
  );
}
