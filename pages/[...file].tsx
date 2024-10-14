// import modules
import React from "react";
import {GetStaticPaths, GetStaticProps, GetStaticPropsContext} from "next";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";
import {readFilesPaths, readFileContents} from "../lib/helpers.ts";

// import interfaces
import {FileRelativePath, DocumentationPageProps} from "../lib/interfaces.ts";

const
    // async retrieval of ids to populate the
    // list of pages to statically generate
    getStaticPaths: GetStaticPaths = async() => {
        const
            // async retrieval
            paths: Array<FileRelativePath> = await readFilesPaths();

        return {paths, fallback: false};
    },
    // async retrieval of props for static site generation
    getStaticProps: GetStaticProps = async(context: GetStaticPropsContext) => {
        const
            // read context
            {params} = context,
            // async retrieval (typescript situation again)
            data = await readFileContents(params?.file ? [ ...params.file ] : [ `` ]);
        // pass object as props to the page
        return {props: {data}};
    };

// export static site generation function in a namespace
export {getStaticProps, getStaticPaths};

const
    // page component
    DocumentationPage = (props: DocumentationPageProps): React.JSX.Element => {
        const
            // extract props
            {data} = props;

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