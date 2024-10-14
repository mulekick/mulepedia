/* eslint-disable @stylistic/indent-binary-ops */

// import primitives
import {writeFile} from "node:fs/promises";

// import modules
import {GetStaticProps, GetStaticPropsContext} from "next";
import {DOMAIN, readFiles} from "../lib/helpers.ts";

// import interfaces
import {FileMetadata} from "../lib/interfaces.ts";

const

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getStaticProps: GetStaticProps = async(context: GetStaticPropsContext) => {
        const
            // retrieve list of files
            data: Array<FileMetadata> = await readFiles();

        let
            // generate markdown on the fly
            sitemapLinks = ``;

        data.forEach((x: FileMetadata): undefined => {
            const
                // extract variables
                {relativePath} = x;

            // add list entry (append .html extension at build time so the routes still match ...)
            sitemapLinks += `   <url>\n` +
                            `       <loc>${ DOMAIN }/${ relativePath }</loc>\n` +
                            `       <priority>0.5</priority>\n` +
                            `   </url>\n`;
        });

        // return sitemap
        const sitemap: string = `<?xml version="1.0" encoding="UTF-8"?>\n` +
                               `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
                               `    <url>\n` +
                               `        <loc>${ DOMAIN }/</loc>\n` +
                               `        <priority>1.0</priority>\n` +
                               `    </url>\n` +
                               // eslint-disable-next-line @typescript-eslint/no-unnecessary-template-expression
                               `${ String(sitemapLinks) }` +
                               `</urlset>`;

        // export to public folder
        await writeFile(`./public/sitemap.xml`, sitemap, {encoding: `utf8`});

        // return robots.txt
        const robots: string = `# allow crawling and indexing of the whole site\n` +
                               `User-agent: *\n` +
                               `Disallow:\n` +
                               `\n` +
                               `# include the path to sitemap.xml\n` +
                               `Sitemap: ${ DOMAIN }/sitemap.xml`;

        // export to public folder
        await writeFile(`./public/robots.txt`, robots, {encoding: `utf8`});

        // return a 404 weSmart
        return {notFound: true};
    };

// export static site generation function in a namespace ...
export {getStaticProps};

const
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    SiteMap = (props: Record<string, never>): undefined => {
        // ...
    };

// export page as default
export default SiteMap;