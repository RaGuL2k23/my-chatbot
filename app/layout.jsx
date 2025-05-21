import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Document Chatbot | Built with Supabase & Gemini",
  description: "Chat with your documents using AI. Built with Next.js, Supabase, and Gemini API by Ragul.",
  authors: [{ name: "Ragul", url: "https://raguls.vercel.app" }],
  keywords: [
    "AI",
    "Chatbot",
    "PDF Chat",
    "Gemini",
    "Supabase",
    "Next.js",
    "Ragul",
    "Document AI",
    "with memory "
  ],
  creator: "Ragul",
  themeColor: "#0f172a",
  openGraph: {
    title: "AI Document Chatbot by raguls",
    description: "Ask questions about your documents using AI.",
    url: "https://raguls.vercel.app",
    siteName: "Ragul's AI Chatbot",
    type: "website",
    images: [
      {
        url: "https://www.freepik.com/free-vector/chatbot-chat-message-vectorart_125886829.htm#fromView=keyword&page=1&position=0&uuid=b2128bdf-53ef-4453-ba08-3def8a46b8c0&query=Chatbot+Png",  
        width: 1200,
        height: 630,
        alt: "AI Document Chatbot Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Document Chatbot by Ragul",
    description: "Chat with documents using AI. Built with Supabase & Gemini.",
    creator: "@yourTwitterHandle", 
    images: ["https://ragul2k23.github.io/homepage/images/port.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-[100vw] h-[100vh] overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden bg-gray-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
