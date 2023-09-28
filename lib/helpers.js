/* eslint-disable node/no-process-env */

// import primitives
import process from "node:process";
import path from "node:path";
import {readFile} from "node:fs/promises";

// import modules
import readdirp from "readdirp";
import matter from "gray-matter";
import {Octokit} from "@octokit/core";

const
    // symlink to *.md files directory
    docsDirectory = `docs`,
    // -------------------------------------------------
    // recursively parse directories (returns a promise)
    parseDirectory = dir => readdirp.promise(dir, {
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
    readFiles = async() => {
        const
            // get all files
            files = await parseDirectory(docsDirectory),
            // retrieve files contents
            filesContents = await Promise.all(files.map(x => {
                const
                    // retrieve full path
                    {fullPath} = x;
                // return promise
                return readFile(fullPath, `utf8`);
            }));

        return files
            .map((x, i) => ({
                // uniquely identify each file by its relative path - remove extension
                // use dot notation to avoid shadowing path primitive
                relativePath: path.join(docsDirectory, x.path.replace(/\.md$/u, ``)),
                // parse file metadata
                ...matter(filesContents.at(i)).data
            }))
            // filter by publishing status
            .filter(x => x.publish === true)
            // sort files by index
            .sort((a, b) => (a.index > b.index ? 1 : -1));
    },
    // -------------------------------------------------
    // handle dynamic routing - generate dynamic routes from files
    readFilesPaths = async() => {
        const
            // get all files
            files = await parseDirectory(docsDirectory);

        // read files list, remove extensions and split the relative path of each file
        // the resulting array will be used to identify each file and create a route for it
        // generated routes will be handled by the catch-all segment pages/[...file].jsx
        // see https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
        return files.map(x => ({params: {file: [ docsDirectory, ...x.path.replace(/\.md$/u, ``).split(`/`) ]}}));
    },
    // -------------------------------------------------
    // handle dynamic routing - retrieve and format file contents
    readFileContents = async file => {
        const
            // reconstruct relative path, append file extension
            relativePath = `${ path.join(...file) }.md`,
            // retrieve file contents
            fileContents = await readFile(relativePath, `utf8`),
            // parse the file metadata and contents section
            {data, content} = matter(fileContents),
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
            // spread file metadata
            ...data
        };
    };

export {readFiles, readFilesPaths, readFileContents};