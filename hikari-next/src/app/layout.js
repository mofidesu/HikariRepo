import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: "HIKARI | E-Ticaret'in Yeni Yansıması",
  description: "HIKARI Premium E-ticaret platformu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} antialiased h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen flex flex-col font-body-lg relative overflow-x-hidden">
        {/* Global Background Elements */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/30 rounded-full blur-3xl z-[-1] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-fixed/30 rounded-full blur-3xl z-[-1] pointer-events-none"></div>
        
        {children}
      </body>
    </html>
  );
}
