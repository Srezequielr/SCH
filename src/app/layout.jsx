import { Alegreya, Alegreya_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Alegreya({
  variable: "--font-geist-sans",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const geistMono = Alegreya_Sans({
  variable: "--font-geist-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Sistema de Control de Horarios",
  description: "Aplicacion web para el control de horarios, desarrollada por Julian Riera",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
