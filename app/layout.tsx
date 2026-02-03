import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google"; // Import the font
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const nastaliq = Noto_Nastaliq_Urdu({ 
  subsets: ["arabic"],
  weight: ["400", "700"], // Noto Nastaliq usually has specific weights
  variable: "--font-nastaliq",
});

export const metadata: Metadata = {
  title: "Kashmiri AI Translator",
  description: "English to Kashmiri Translation & TTS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${nastaliq.variable}`}>{children}</body>
    </html>
  );
}
