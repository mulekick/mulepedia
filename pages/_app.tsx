// import modules
import React from "react";
import {AppProps} from "next/app.js";

// force dark theme
import "github-markdown-css/github-markdown-dark.css";
import "../scss/main.scss";

const
    // create the app wrapper component
    AppWrapper = (props: AppProps): React.JSX.Element => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const {Component, pageProps} = props;

        return <Component { ...pageProps } />;
    };

export default AppWrapper;