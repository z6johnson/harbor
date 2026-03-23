import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "harbor",
  description: "AI solution intake — UC San Diego",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
