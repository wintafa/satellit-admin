// import type { Metadata } from "next";
import "./globals.scss";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
