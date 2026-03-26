import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="es" className={`${inter.variable} dark antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-body text-foreground flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
