import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Lucas Amos",
  description: "AWS application architect",
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
