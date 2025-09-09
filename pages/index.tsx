/* eslint-disable n/no-process-env */

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
import React from "react";
import Script from "next/script";
import Layout from "../components/layout.tsx";
import Content from "../components/content.tsx";
// eslint-disable-next-line import/no-unresolved
import {Octokit} from "@octokit/core";
import {readFiles} from "../lib/helpers.ts";

// import types
import type {GetStaticProps, GetStaticPropsContext} from "next";
import type {FileMetadata, HomePageProps} from "../lib/interfaces.ts";

// async retrieval of props for static site generation will run once at
// build time and return props that can be used for page generation

// export static site generation function in a namespace ...
export const getStaticProps: GetStaticProps = async(context: GetStaticPropsContext) => {
    // typescript
    void context;
    // use dynamic imports in getStaticProps because static imports seem to be resolved only at build time ...
    const {DOMAIN} = await import(`../lib/helpers.ts`);
    // retrieve list of files
    const data: Array<FileMetadata> = await readFiles();
    // no authentication required to access the github markdown api ...
    const octokit = new Octokit();

    // generate markdown on the fly
    let content = `## Topics\n`;
    let currentCategory: string | null = null;

    data.forEach((x: FileMetadata, i: number): undefined => {
        // extract variables
        const {relativePath, title, category} = x;
        // add / update category
        if (category !== currentCategory) {
            // close previous category
            if (currentCategory !== null)
                content += `</details>\n`;
            // format category hash
            content += `<details id="${ category.toLowerCase().replaceAll(/[^a-z ]/gu, ``).replaceAll(/\s+/gu, `-`) }">\n`;
            content += `<summary><b>${ category }</b></summary>\n\n`;
            currentCategory = category;
        }
        // add list entry (append .html extension at build time so the routes still match ...)
        content += `- [${ title }](${ relativePath })\n\n`;
        // close last category
        if (i === data.length - 1)
            content += `</details>\n`;
    });

    // throw if github token is missing
    if (typeof process.env.GITHUB_TOKEN !== `string` || !process.env.GITHUB_TOKEN.length)
        throw new Error(`invalid github token`);

    // parse the file markdown content into html
    const formattedHtml = await octokit.request(`POST /markdown`, {
        text: content,
        headers: {
            'X-GitHub-Api-Version': `2022-11-28`,
            Authorization: `token ${ process.env.GITHUB_TOKEN }`,
            accept: `application/vnd.github+json`
        }
    }) as {data: string};

    // pass object as props to the page
    return {
        props: {
            htmlContents: formattedHtml.data,
            canonicalUrl: DOMAIN
        }
    };
};

// page component
const HomePage = (props: HomePageProps): React.JSX.Element => {
    // extract props
    const {htmlContents, canonicalUrl} = props;
    // return component
    return (
        <React.Fragment>
            <Script
                src={ `/external.js` }
                strategy={ `beforeInteractive` }
                onLoad={ () => {
                    // eslint-disable-next-line n/prefer-global/console
                    console.log(`external script loaded.`);
                } }
            />
            <Layout
                homepage={ true }
                title={ `Documentation index` }
                description={ `Tech related digests, cheatsheets and howtos, from beginner to advanced` }
                keywords={ `mulepedia,homepage,tech,digest,cheatsheet` }
                canonicalUrl={ canonicalUrl }
                outletComponent={ <Content data={ {htmlContents} } /> }
            />
        </React.Fragment>
    );
};

// export page as default
export default HomePage;