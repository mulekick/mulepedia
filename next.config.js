// import primitives
// import {URL, fileURLToPath} from "node:url";
// import {resolve} from "node:path";

const
    // retrieve project folder folder
    // dirName = fileURLToPath(new URL(`.`, import.meta.url)),
    // next.js config options
    nextConfig = {
        // add another layer of enforcing react strict mode
        reactStrictMode: true,

        // custom build directory ...
        // (disabled for vercel deployment)
        // distDir: `build`,

        // export the app as a static HTML website
        // (disabled for vercel deployment)
        // output: `export`,

        // required for static exports since the <Image> component optimizes
        // image loading on demand and thus requires a server ...
        // https://github.com/vercel/next.js/issues/40240
        // https://nextjs.org/docs/messages/export-image-api
        // https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
        images: {unoptimized: true}
    };

export default nextConfig;