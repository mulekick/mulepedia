// import modules
import React from "react";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";

// import types
import type {GetStaticProps, GetStaticPropsContext} from "next";
import type {NotFoundPageProps} from "../lib/interfaces.ts";

// export static site generation function in a namespace ...
export const getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => {
    // typescript
    void context;
    // pass object as props to the page
    return {props: {htmlContents: `<h1>Guess what it's a 404</h1>`}};
};

// page component
const PageNotFound = (props: NotFoundPageProps): React.JSX.Element => {
    // extract props
    const {htmlContents} = props;
    // return component
    return (
        <Layout
            homepage={ false }
            title={ `No matching content found` }
            description={ `Nothing to see here` }
            keywords={ `` }
            canonicalUrl={ null }
            outletComponent={ <Content data={ {htmlContents} } /> }
        />
    );
};

// export page as default
export default PageNotFound;