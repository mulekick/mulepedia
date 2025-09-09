/* eslint-disable n/no-process-env */

// import primitives
import process from "node:process";
import path from "node:path";
import {readFile} from "node:fs/promises";

// import modules
import readdirp from "readdirp";
import matter from "gray-matter";
// eslint-disable-next-line import/no-unresolved
import {Octokit} from "@octokit/core";

// import types
import type {FileRelativePath, FileMetadata, PageContents} from "./interfaces.ts";

// symlink to *.md files directory
const docsDirectory = `docs`;

// recursively parse directories (returns a promise)
const parseDirectory = (dir: string): Promise<Array<readdirp.EntryInfo>> => readdirp.promise(dir, {
    // filter file extensions (hidden files not processed by default ...)
    fileFilter: [ `*.md`, `.*.md` ],
    // filter subdirectories
    directoryFilter: [ `*` ],
    // parse subdirectories to n-depth
    depth: 5,
    // only process regular files
    type: `files`,
    // do not stat, return custom entry format
    alwaysStat: false,
    // ignore symilnks
    lstat: false
});

// domain
export const DOMAIN = `https://mulepedia.vercel.app`;

// handle dynamic routing - read files list
export const readFiles = async(): Promise<Array<FileMetadata>> => {
    // get all files
    const files: Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory);
    // retrieve files contents
    const filesContents: Array<matter.Input> = await Promise.all(files.map(x => {
        // retrieve full path, return promise
        const {fullPath} = x;
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        return readFile(fullPath, `utf8`);
    }));

    return files
        .map((x: readdirp.EntryInfo, i: number): FileMetadata => {
            // parse the file metadata section + typescript
            // eslint-disable-next-line security/detect-object-injection
            const {title, category, description, keywords, index, publish} = matter(filesContents[i]).data as FileMetadata;
            return {
                // uniquely identify each file by its relative path - remove extension
                // use dot notation to avoid shadowing path primitive
                relativePath: path.join(x.path.replace(/\.md$/u, ``)),
                title,
                category,
                description,
                keywords,
                index,
                publish
            };
        })
        // filter by publishing status
        .filter((x: FileMetadata): boolean => x.publish)
        // sort files by index
        .sort((a: FileMetadata, b: FileMetadata): number => (a.index && b.index ? a.index > b.index ? 1 : -1 : 0));
};

// handle dynamic routing - generate dynamic routes from files
export const readFilesPaths = async(): Promise<Array<FileRelativePath>> => {
    // get all files
    const files: Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory);
    // read files list, remove extensions and split the relative path of each file
    // the resulting array will be used to identify each file and create a route for it
    // generated routes will be handled by the catch-all segment pages/[...file].jsx
    // see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
    // docs directory is not included as a route segment for SEO purposes
    return files.map((x: readdirp.EntryInfo): FileRelativePath => ({params: {file: x.path.replace(/\.md$/u, ``).split(`/`)}}));
};

// handle dynamic routing - retrieve and format file contents
export const readFileContents = async(filePathSegments: Array<string>): Promise<PageContents> => {
    // reconstruct relative path
    const relativePath = path.join(...filePathSegments);
    // create canonical url for meta tags
    const canonicalUrl = `${ DOMAIN }/${ relativePath }`;
    // retrieve file contents, append file extension
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileContents = await readFile(`${ docsDirectory }/${ relativePath }.md`, `utf8`);
    // parse the file metadata and contents section
    const {data: {title, category, description, keywords, index, publish}, content} = matter(fileContents) as unknown as {data: FileMetadata; content: string};
    // no authentication required to access the github markdown api ...
    const octokit = new Octokit();
    // throw if github token is missing
    if (typeof process.env.GITHUB_TOKEN !== `string` || !process.env.GITHUB_TOKEN.length)
        throw new Error(`invalid github token`);
    // parse the file markdown content into html
    const formattedHtml = await octokit.request(`POST /markdown`, {
        // replace .md by .html in inner links for consistency
        text: content.replace(/\.md(?=\))/gu, ``),
        headers: {
            'X-GitHub-Api-Version': `2022-11-28`,
            Authorization: `token ${ process.env.GITHUB_TOKEN }`,
            accept: `application/vnd.github+json`
        }
    }) as {data: string};
    return {
        // since the routes have been generated at this stage already
        // there is no need to manage a unique id whatsoever
        relativePath,
        // export html content
        htmlContents: formattedHtml.data,
        title,
        category,
        description,
        keywords,
        index,
        publish,
        canonicalUrl
    };
};