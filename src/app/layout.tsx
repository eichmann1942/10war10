import './globals.css';
import React from 'react';

export const metadata = {
  title: 'MY AGIT',
  description: '나만의 퍼스널 웹 아지트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}