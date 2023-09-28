/* eslint-disable node/no-process-env, react/prop-types, react/react-in-jsx-scope */

/**
 * Page rendered using static site generation :
 * - all the necessary data is already present
 * - initial page rendering does not require any data fetching
 * - hydration will happen during build time and not client side
 * - some JS code will run on the page still
 */

// import primitives
import process from "node:process";

// import modules
import Layout from "../components/layout.jsx";
import Article from "../components/article.jsx";
import {Octokit} from "@octokit/core";
import {readFiles} from "../lib/helpers.js";

const
    // async retrieval of props for static site generation
    // will run once at build time and return props that can
    // be used for page generation
    getStaticProps = async context => {
        const
            // retrieve list of files
            data = await readFiles(),
            // no authentication required to access the github markdown api ...
            octokit = new Octokit();

        let
            // generate markdown on the fly
            content = `## Pages\n`;

        data.forEach(x => {
            const
                // extract variables
                {relativePath, title} = x;

            // add list entry (append .html extension at build time so the routes still match ...)
            content += `- [${ title }](${ relativePath }${ process.env.NODE_ENV === `production` ? `.html` : `` })\n`;
        });

        const
            // parse the file markdown content into html
            formattedHtml = await octokit.request(`POST /markdown`, {
                text: content,
                headers: {
                    'X-GitHub-Api-Version': `2022-11-28`,
                    accept: `application/vnd.github+json`
                }
            });
        // pass object as props to the page
        return {props: {htmlContents: formattedHtml.data}};
    };

// export static site generation function in a namespace ...
export {getStaticProps};

const
    // page component
    HomePage = props => {
        const
            // extract props
            {htmlContents} = props;

        // return component
        return <Layout index={true} title={ `Mulepedia` } description={ `documentation index` } outletComponent={ <Article data={ {htmlContents} }/> }/>;
    };

// export page as default
export default HomePage;