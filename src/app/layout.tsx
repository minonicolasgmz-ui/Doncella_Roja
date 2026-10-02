import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Doncella Roja — Recorrido Interactivo",
  description: "Actividad educativa interactiva basada en la novela La Doncella Roja de Sandra Siemens. Mapa del recorrido, museo de piezas y decisión.",
  keywords: ["La Doncella Roja", "Sandra Siemens", "novela", "educación", "mapa interactivo"],
  authors: [{ name: "Actividad educativa" }],
  openGraph: {
    title: "La Doncella Roja — Recorrido Interactivo",
    description: "Actividad educativa interactiva basada en la novela La Doncella Roja de Sandra Siemens. Mapa del recorrido, museo de piezas y decisión.",
    url: "https://doncella-roja-interactiva.vercel.app/",
    siteName: "La Doncella Roja — Recorrido Interactivo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Doncella Roja — Recorrido Interactivo",
    description: "Actividad educativa interactiva basada en la novela La Doncella Roja de Sandra Siemens. Mapa del recorrido, museo de piezas y decisión.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
