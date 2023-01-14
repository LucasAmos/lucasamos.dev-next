import PropTypes from "prop-types";
import React from "react";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};
