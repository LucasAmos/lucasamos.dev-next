import { ReactNode } from "react";
import { AppProps } from "next/app";
import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps): ReactNode {
  return <Component {...pageProps} />;
}
