/* eslint-disable node/no-process-env */

// import primitives
import process from "node:process";
import path from "node:path";
import {readFile} from "node:fs/promises";

// import modules
import readdirp from "readdirp";
import matter from "gray-matter";
import {Octokit} from "@octokit/core";

// declare interfaces
export interface FileRelativePath {
    params:{file:Array<string>}
}

export interface FileMetadata {
    relativePath:string;
    title:string;
    description:string;
    index:number;
    publish:boolean;
}

export interface FileContents extends FileMetadata {
    htmlContents:string;
}

const
    // symlink to *.md files directory
    docsDirectory = `docs`,
    // -------------------------------------------------
    // recursively parse directories (returns a promise)
    parseDirectory = (dir:string):Promise<Array<readdirp.EntryInfo>> => readdirp.promise(dir, {
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
    readFiles = async():Promise<Array<FileMetadata>> => {
        const
            // get all files
            files:Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory),
            // retrieve files contents
            filesContents:Array<matter.Input> = await Promise.all(files.map(x => {
                const
                    // retrieve full path
                    {fullPath} = x;
                // return promise
                return readFile(fullPath, `utf8`);
            }));

        return files
            .map((x:readdirp.EntryInfo, i:number):FileMetadata => {
                const
                    // parse the file metadata section
                    {data: {title, description, index, publish}} = matter(filesContents.at(i) ?? ``);

                return {
                    // uniquely identify each file by its relative path - remove extension
                    // use dot notation to avoid shadowing path primitive
                    relativePath: path.join(docsDirectory, x.path.replace(/\.md$/u, ``)),
                    // eslint-disable-next-line object-property-newline
                    title, description, index, publish
                };
            })
            // filter by publishing status
            .filter((x:FileMetadata):boolean => x.publish === true)
            // sort files by index
            .sort((a:FileMetadata, b:FileMetadata):number => (a.index && b.index ? a.index > b.index ? 1 : -1 : 0));
    },
    // -------------------------------------------------
    // handle dynamic routing - generate dynamic routes from files
    readFilesPaths = async():Promise<Array<FileRelativePath>> => {
        const
            // get all files
            files:Array<readdirp.EntryInfo> = await parseDirectory(docsDirectory);

        // read files list, remove extensions and split the relative path of each file
        // the resulting array will be used to identify each file and create a route for it
        // generated routes will be handled by the catch-all segment pages/[...file].jsx
        // see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
        return files.map((x:readdirp.EntryInfo):FileRelativePath => ({params: {file: [ docsDirectory, ...x.path.replace(/\.md$/u, ``).split(`/`) ]}}));
    },
    // -------------------------------------------------
    // handle dynamic routing - retrieve and format file contents
    readFileContents = async(filePathSegments:Array<string>):Promise<FileContents> => {
        const
            // reconstruct relative path, append file extension
            relativePath = `${ path.join(...filePathSegments) }.md`,
            // retrieve file contents
            fileContents = await readFile(relativePath, `utf8`),
            // parse the file metadata and contents section
            {data: {title, description, index, publish}, content} = matter(fileContents),
            // no authentication required to access the github markdown api ...
            octokit = new Octokit(),
            // parse the file markdown content into html
            formattedHtml = await octokit.request(`POST /markdown`, {
                // replace .md by .html in inner links for consistency
                text: content.replace(/\.md(?=\))/gu, process.env.NODE_ENV === `production` ? `.html` : ``),
                headers: {
                    'X-GitHub-Api-Version': `2022-11-28`,
                    accept: `application/vnd.github+json`
                }
            });

        return {
            // since the routes have been generated at this stage already
            // there is no need to manage a unique id whatsoever
            relativePath,
            // export html content
            htmlContents: formattedHtml.data,
            // eslint-disable-next-line object-property-newline
            title, description, index, publish
        };
    };

export {readFiles, readFilesPaths, readFileContents};