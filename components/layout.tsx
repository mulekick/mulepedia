/* eslint-disable no-shadow */

// import modules
import Head from "next/head.js";
import Link from "next/link.js";
import Image from "next/image.js";

// import modules
import React from "react";

// import interfaces
import {LayoutProps} from "../lib/interfaces.ts";

const

    // app layout component
    Layout = (props:LayoutProps):React.JSX.Element => {
        const
            // extract props
            {homepage, title, description, keywords, canonicalUrl, outletComponent} = props;

        // return component
        return <>
            <Head>
                { /* using the head tag layout from mdn as of now */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <title>{ `${ title } - Mulepedia` }</title>
                <meta name="description" content={ description } />
                <meta name="author" content="mulekick (https://github.com/mulekick)" />
                <meta name="generator" content="next.js (https://nextjs.org/)" />
                <meta name="keywords" content={ keywords } />
                <meta name="referrer" content="origin" />
                {
                    // domain, image and profile are required for opengraph, however
                    // I'm not passing these as props to the component for now ...
                    canonicalUrl ?
                        <>
                            { /* crawling and indexing tags */}
                            <meta name="robots" content="index, follow" />
                            <link rel="canonical" href={ canonicalUrl } />

                            {/* Facebook Meta Tags */}
                            <meta property="og:title" content={ `${ title } - Mulepedia` } />
                            <meta property="og:description" content={ description } />
                            <meta property="og:url" content={ canonicalUrl } />
                            <meta property="og:image" content="https://mulepedia.vercel.app/og-image.png" />
                            <meta property="og:image:type" content="image/png" />
                            <meta property="og:image:width" content="445" />
                            <meta property="og:image:height" content="445" />

                            {
                                homepage ?
                                    // identify home page as a website
                                    <meta property="og:type" content="website" /> :
                                    // else, identify as an article (can't return a fragment here for some reason ...)
                                    [
                                        <meta key={ 0 } property="og:type" content="article" />,
                                        <meta key={ 1 } property="og:article:section" content="Tech digest" />,
                                        <meta key={ 2 } property="og:article:author" content="https://github.com/mulekick" />,
                                        // add opengraph compliant tags for keywords
                                        ...keywords.split(`,`).map((x:string, i:number):React.JSX.Element => <meta key={ i + 2 } property="og:article:tag" content={ x } />)
                                    ]
                            }

                            {/* Twitter Meta Tags - rely on og fallbacks as much as possible ... */}
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:creator" content="@moolekick" />
                            <meta name="twitter:creator" content="@moolekick" />
                        </> :
                        // block web crawling if canonical url is not set
                        <meta name="robots" content="noindex, nofollow" />
                }
            </Head>
            <nav>
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
                { homepage ? <span className="page-title">This is the home page</span> : <Link className="page-title" href={ `/` }>Back to the home page</Link> }
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
            </nav>
            {/* the nav + container pattern has to be implemented here */}
            <main>
                <article>
                    <header className="article-header">
                        <div>
                            <h1 className="page-title">{ title }</h1>
                            <p className="page-desc">{ description }</p>
                        </div>
                        <Link href={ `https://github.com/mulekick/mulepedia` }>
                            <Image src="/gh-logo.png" height={ 25 } width={ 25 } alt="view on github" />
                        </Link>
                    </header>
                    {
                        // display the component for the current route ...
                        outletComponent
                    }
                </article>
            </main>
        </>;
    };

// export component
export default Layout;