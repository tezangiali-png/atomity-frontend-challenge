import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Multi-Cloud Cost Intelligence — Atomity Frontend Challenge",
  description:
    "An original, animated reinterpretation of a multi-cloud cost visualization concept.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
