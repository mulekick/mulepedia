/* eslint-disable react/prop-types, react/react-in-jsx-scope */

// force dark theme
import "github-markdown-css/github-markdown-dark.css";
import "../scss/main.scss";

const
    // create the app wrapper component
    AppWrapper = props => {
        const
            // extract props
            {Component, pageProps} = props;

        return <Component { ...pageProps } />;
    };

export default AppWrapper;