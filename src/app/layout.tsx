import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Lucas Amos",
  description: "AWS application architect",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
