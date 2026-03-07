// import type { Metadata } from "next";
import "./globals.scss";
import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import type { Metadata } from 'next'

// 🔹 Метаданные для всего сайта
export const metadata: Metadata = {
  title: {
    default: 'ФК Сателлит — Футбольная команда из Орехово-Зуево',
    template: '%s | ФК Сателлит',
  },
  description: 'Официальный сайт футбольной команды Сателлит',
  
  // 🔹 Иконки (favicon):
  icons: {
    icon: '/favicon.ico',           // Базовая иконка
    shortcut: '/favicon.ico',       // Для старых браузеров
    apple: '/logo1.png', // Для iOS
    other: {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/logo1.svg',
    },
  },
  
  // 🔹 Дополнительно (опционально):
  manifest: '/site.webmanifest',    // Если есть PWA-манифест
  appleWebApp: {
    capable: true,
    title: 'ФК Сателлит',
    statusBarStyle: 'black-translucent',
  },
}





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
