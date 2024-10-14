// import modules
import React from "react";
import {GetStaticProps, GetStaticPropsContext} from "next";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";

// import interfaces
import {NotFoundPageProps} from "../lib/interfaces.ts";

const
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, arrow-body-style
    getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => {
        // pass object as props to the page
        return {props: {htmlContents: `<h1>Guess what it's a 404</h1>`}};
    };

// export static site generation function in a namespace ...
export {getStaticProps};

const
    // page component
    PageNotFound = (props: NotFoundPageProps): React.JSX.Element => {
        const
            // extract props
            {htmlContents} = props;

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