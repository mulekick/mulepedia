/* eslint-disable node/no-unpublished-import */

// import modules
import React from "react";
import {AppProps} from "next/app.js";

// force dark theme
import "github-markdown-css/github-markdown-dark.css";
import "../scss/main.scss";

const
    // create the app wrapper component
    AppWrapper = (props:AppProps):React.JSX.Element => {
        const
            // extract props
            {Component, pageProps} = props;

        return <Component { ...pageProps } />;
    };

export default AppWrapper;