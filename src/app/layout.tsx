import type { Metadata, Viewport } from "next";
import { Lexend, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { DemoPanel } from "@/components/DemoPanel";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Base Cero — Aprende a programar desde cero",
  description:
    "Piloto de Base Cero: cursos cortos de programación y bases de datos para principiantes. Clases de 20 minutos, ejercicios que se revisan solos y dudas respondidas en 24 horas.",
};

export const viewport: Viewport = {
  themeColor: "#2A1350",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${lexend.variable} ${jetbrains.variable} antialiased`}>
      <body className="min-h-screen">
        <StoreProvider>
          {children}
          <DemoPanel />
        </StoreProvider>
      </body>
    </html>
  );
}
