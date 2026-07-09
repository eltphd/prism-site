import type { Metadata } from "next";
import { Archivo_Black, Courier_Prime } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "PRISM — Free Art Week for Teens",
  description:
    "PRISM is a free art week for teens 13–19 in Canal Winchester, OH. Jul 13–17, Mon–Fri, 11am–2pm at David's UCC. No sign-up needed — everyone gets a free journal, attending enters you to win $50.",
  openGraph: {
    title: "PRISM — Free Art Week for Teens",
    description:
      "Free art week for teens 13–19. Jul 13–17 · Mon–Fri · 11am–2pm · David's UCC, Canal Winchester, OH. No sign-up needed.",
    url: "https://prism.feelingsunplugged.com",
    siteName: "PRISM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivoBlack.variable} ${courierPrime.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
