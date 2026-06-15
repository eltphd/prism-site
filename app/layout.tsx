import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISM — Free Summer Wellness for Teens",
  description:
    "PRISM is a free summer wellness space for teens ages 13–19 in Canal Winchester, OH. Mon–Fri, 10am–3pm. No sign-up needed. LGBTQIA+ affirming. Everyone welcome.",
  openGraph: {
    title: "PRISM — Free Summer Wellness for Teens",
    description:
      "A free summer wellness space for teens 13–19 in Canal Winchester, OH. Drop in anytime Mon–Fri 10am–3pm.",
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
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
