// import modules
import React from "react";
import {GetStaticProps, GetStaticPropsContext} from "next";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";

// declare interfaces
interface PropsSignature {
    htmlContents:string
}

const
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars, arrow-body-style
    getStaticProps:GetStaticProps = (context:GetStaticPropsContext) => {
        // pass object as props to the page
        return {props: {htmlContents: `<h1>Guess what it's a 404</h1>`}};
    };

// export static site generation function in a namespace ...
export {getStaticProps};

const
    // page component
    PageNotFound = (props:PropsSignature):React.JSX.Element => {
        const
            // extract props
            {htmlContents} = props;

        // return component
        return <Layout
            index={false}
            title={ `No matching content found` }
            description={ `Nothing to see here` }
            keywords={ `` }
            canonicalUrl={ null }
            outletComponent={ <Content data={ {htmlContents} }/> }
        />;
    };

// export page as default
export default PageNotFound;