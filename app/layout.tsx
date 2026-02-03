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
  title: "Kashmiri AI Translator and Audio Generator | Gaash Lab",
  description: "Experience state-of-the-art English to Kashmiri translation and natural-sounding audio generation. Developed at Gaash Lab, this tool offers precise neural machine translation and high-quality Text-to-Speech (TTS).",
  keywords: ["Kashmiri AI", "English to Kashmiri", "Translator", "Audio Generator", "TTS", "Gaash Lab", "Machine Translation", "Kashmir", "Language Tool"],
  authors: [{ name: "Gaash Lab" }],
  creator: "Gaash Lab",
  openGraph: {
    title: "Kashmiri AI Translator and Audio Generator",
    description: "Convert English text to Kashmiri with high accuracy and generate natural speech audio.",
    type: "website",
    locale: "en_US",
    siteName: "Kashmiri AI Translator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashmiri AI Translator | Gaash Lab",
    description: "Seamless English to Kashmiri translation and audio generation.",
  },
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
