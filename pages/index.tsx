/* eslint-disable node/no-unpublished-import, node/no-unsupported-features/es-syntax */


/**
 * Page rendered using static site generation :
 * - all the necessary data is already present
 * - initial page rendering does not require any data fetching
 * - hydration will happen during build time and not client side
 * - some JS code will run on the page still
 */

// import modules
import React from "react";
import {GetStaticProps, GetStaticPropsContext} from "next";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";
import {Octokit} from "@octokit/core";
import {readFiles} from "../lib/helpers.ts";

// import interfaces
import {FileMetadata, HomePageProps} from "../lib/interfaces.ts";

const
    // async retrieval of props for static site generation
    // will run once at build time and return props that can
    // be used for page generation

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    getStaticProps:GetStaticProps = async(context:GetStaticPropsContext) => {
        const
            // use dynamic imports in getStaticProps because static
            // imports seem to be resolved only at build time ...
            {DOMAIN} = await import(`../lib/helpers.ts`),
            // retrieve list of files
            data:Array<FileMetadata> = await readFiles(),
            // no authentication required to access the github markdown api ...
            octokit = new Octokit();

        let
            // generate markdown on the fly
            content = `## Pages\n`;

        data.forEach((x:FileMetadata):undefined => {
            const
                // extract variables
                {relativePath, title} = x;

            // add list entry (append .html extension at build time so the routes still match ...)
            content += `- [${ title }](${ relativePath })\n`;
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
        return {
            props: {
                htmlContents: formattedHtml.data,
                canonicalUrl: DOMAIN
            }
        };
    };

// export static site generation function in a namespace ...
export {getStaticProps};

const
    // page component
    HomePage = (props:HomePageProps):React.JSX.Element => {
        const
            // extract props
            {htmlContents, canonicalUrl} = props;

        // return component
        return <Layout
            homepage={true}
            title={ `Documentation index` }
            description={ `Tech related digests, cheatsheets and howtos ...` }
            keywords={ `mulepedia,homepage,tech,digest,cheatsheet` }
            canonicalUrl={ canonicalUrl }
            outletComponent={ <Content data={ {htmlContents} }/> }
        />;
    };

// export page as default
export default HomePage;