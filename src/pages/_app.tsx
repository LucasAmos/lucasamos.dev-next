/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from "prop-types";
import React from "react";
import "../styles/global.css";

export default function App({ Component, pageProps }: { Component: any; pageProps: any }) {
  return <Component {...pageProps} />;
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
