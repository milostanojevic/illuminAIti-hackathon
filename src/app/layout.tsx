import type { Metadata, Viewport } from "next";
import "./globals.css";

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
      <body className="min-h-dvh w-full min-w-0 box-border overflow-x-hidden flex justify-center items-stretch bg-[#2a2a3a] px-0 py-0 sm:py-6 md:py-8 font-sans antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
