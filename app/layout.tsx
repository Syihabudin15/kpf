import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Script from "next/script";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME_HEADER}`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME_HEADER}`,
  },
  icons: new URL(
    `${process.env.NEXTAUTH_URL}${process.env.NEXT_PUBLIC_APP_LOGO}`
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <AuthProvider>
          <AntdRegistry>
            <div>{children}</div>
          </AntdRegistry>
        </AuthProvider>
        <Script src="https://cdn.jsdelivr.net/npm/@formulajs/formulajs/lib/browser/formula.min.js"></Script>
      </body>
    </html>
  );
}
