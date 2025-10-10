import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "@/styles/globals.css";

// 메타데이터
const title = "홍대 굿즈샵";
const description = "maro가 정리한 홍대 굿즈샵 정보 지도";
const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://maro-goods.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title,
    siteName: title,
    url,
    description,
    images: [
      {
        url: "/tumb.jpg",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
};

// 폰트
const pretendard = localFont({
  src: "../styles/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}
