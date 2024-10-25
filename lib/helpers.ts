// import primitives
import path from "node:path";
import {readFile} from "node:fs/promises";

// import modules
import readdirp from "readdirp";
import matter from "gray-matter";
// eslint-disable-next-line node/no-missing-import
import {Octokit} from "@octokit/core";

// import types
import type {FileRelativePath, FileMetadata, PageContents} from "./interfaces.ts";

const

    // domain
    DOMAIN = `https://mulepedia.vercel.app`,

    // symlink to *.md files directory
    docsDirectory = `docs`,
    // -------------------------------------------------
    // recursively parse directories (returns a promise)
    parseDirectory = (dir: string): Promise<Array<readdirp.EntryInfo>> => readdirp.promise(dir, {
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
    }),
    // -------------------------------------------------
    // handle dynamic routing - read files list
    readFiles = async(): Promise<Array<FileMetadata>> => {
        const
            // get all files
            files: Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory),
            // retrieve files contents
            filesContents: Array<matter.Input> = await Promise.all(files.map(x => {
                const
                    // retrieve full path
                    {fullPath} = x;
                // return promise
                return readFile(fullPath, `utf8`);
            }));

        return files
            .map((x: readdirp.EntryInfo, i: number): FileMetadata => {
                // parse the file metadata section + typescript
                const {title, description, keywords, index, publish} = matter(filesContents[i]).data as FileMetadata;

                return {
                    // uniquely identify each file by its relative path - remove extension
                    // use dot notation to avoid shadowing path primitive
                    relativePath: path.join(x.path.replace(/\.md$/u, ``)),
                    title,
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
    },
    // -------------------------------------------------
    // handle dynamic routing - generate dynamic routes from files
    readFilesPaths = async(): Promise<Array<FileRelativePath>> => {
        const
            // get all files
            files: Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory);

        // read files list, remove extensions and split the relative path of each file
        // the resulting array will be used to identify each file and create a route for it
        // generated routes will be handled by the catch-all segment pages/[...file].jsx
        // see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
        // docs directory is not included as a route segment for SEO purposes
        return files.map((x: readdirp.EntryInfo): FileRelativePath => ({params: {file: x.path.replace(/\.md$/u, ``).split(`/`)}}));
    },
    // -------------------------------------------------
    // handle dynamic routing - retrieve and format file contents
    readFileContents = async(filePathSegments: Array<string>): Promise<PageContents> => {
        const
            // reconstruct relative path
            relativePath = path.join(...filePathSegments),
            // create canonical url for meta tags
            canonicalUrl = `${ DOMAIN }/${ relativePath }`,
            // retrieve file contents, append file extension
            fileContents = await readFile(`${ docsDirectory }/${ relativePath }.md`, `utf8`),
            // parse the file metadata and contents section
            {data: {title, description, keywords, index, publish}, content} = matter(fileContents) as unknown as {data: FileMetadata; content: string},
            // no authentication required to access the github markdown api ...
            octokit = new Octokit(),
            // parse the file markdown content into html
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            formattedHtml = await octokit.request(`POST /markdown`, {
                // replace .md by .html in inner links for consistency
                text: content.replace(/\.md(?=\))/gu, ``),
                headers: {
                    'X-GitHub-Api-Version': `2022-11-28`,
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
            description,
            keywords,
            index,
            publish,
            canonicalUrl
        };
    };

export {DOMAIN, readFiles, readFilesPaths, readFileContents};