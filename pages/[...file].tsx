// import modules
import React from "react";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";
import {readFilesPaths, readFileContents} from "../lib/helpers.ts";

// import types
import type {GetStaticPaths, GetStaticProps, GetStaticPropsContext} from "next";
import type {FileRelativePath, DocumentationPageProps} from "../lib/interfaces.ts";

// async retrieval of ids to populate the list of pages to statically generate
export const getStaticPaths: GetStaticPaths = async() => {
    const paths: Array<FileRelativePath> = await readFilesPaths();
    return {paths, fallback: false};
};

// async retrieval of props for static site generation
// export static site generation function in a namespace
export const getStaticProps: GetStaticProps = async(context: GetStaticPropsContext) => {
    // read context
    const {params} = context;
    // eslint-disable-next-line @typescript-eslint/no-misused-spread
    const data = await readFileContents(params?.file ? [ ...params.file ] : [ `` ]);
    // pass object as props to the page
    return {props: {data}};
};

// export page as default
const DocumentationPage = (props: DocumentationPageProps): React.JSX.Element => {
    // extract props
    const {data} = props;
    // return component
    return (
        <Layout
            homepage={ false }
            title={ data.title }
            description={ data.description }
            keywords={ data.keywords }
            canonicalUrl={ data.canonicalUrl }
            outletComponent={ <Content data={ data } /> }
        />
    );
};

// export page as default
export default DocumentationPage;