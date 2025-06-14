// import modules
import React from "react";

// import types
// eslint-disable-next-line n/no-missing-import
import type {AppProps} from "next/app.js";

// force dark theme
import "github-markdown-css/github-markdown-dark.css";
import "../scss/main.scss";

// create the app wrapper component
const AppWrapper = (props: AppProps): React.JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {Component, pageProps} = props;
    return <Component { ...pageProps } />;
};

export default AppWrapper;