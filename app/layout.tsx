import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanu's Diary - The World is Quiet Here",
  description: "A mindful exploration of slow travel, where the journey itself becomes the sanctuary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable + " " + playfair.variable + " h-full antialiased"}
    >
      <body className="font-sans min-h-full flex flex-col bg-[#0a0a0a]">
        <SmoothScrollProvider>
          <Navbar />
          <div className="flex-grow flex flex-col">
            {children}
          </div>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
