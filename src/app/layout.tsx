import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Onboarding — KingMakers",
  description: "Personalise your sports and casino experience",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} min-h-dvh w-full min-w-0 box-border flex justify-center items-stretch bg-[#2a2a3a] px-0 py-0 sm:py-6 md:py-8 antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
