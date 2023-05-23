/* eslint-disable react/prop-types, react/react-in-jsx-scope */

// import modules
import Layout from "../components/layout.jsx";
import Article from "../components/article.jsx";
import {readFilesPaths, readFileContents} from "../lib/helpers.js";

const
    // async retrieval of ids to populate the
    // list of pages to statically generate
    getStaticPaths = async() => {
        const
            // async retrieval
            paths = await readFilesPaths();

        return {paths, fallback: false};
    },
    // async retrieval of props for static site generation
    getStaticProps = async context => {
        const
            // read context
            {params: {file}} = context,
            // async retrieval
            data = await readFileContents(file);
        // pass object as props to the page
        return {props: {data}};
    };

// export static site generation function in a namespace
export {getStaticProps, getStaticPaths};

const
    // page component
    DocumentationPage = props => {
        const
            // extract props
            {data} = props;

        // return component
        return <Layout page={ data.description } outletComponent={ <Article data={ data }/> }/>;
    };

// export page as default
export default DocumentationPage;