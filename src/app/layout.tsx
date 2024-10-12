import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Autocare",
  description: "Autocare",
};

export const viewport = {
  initialScale: 1.0,
  width: "device-width",
  colorScheme: "dark"
}

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <body>
        <Header />

        <div className="home">
          {children}
          <Footer />
        </div>
      
      </body>
    </html>
  );
}
