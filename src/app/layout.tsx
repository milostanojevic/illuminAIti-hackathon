import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboarding — KingMakers",
  description: "Personalise your sports and casino experience",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#2a2a3a] flex justify-center p-8 font-sans antialiased">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
