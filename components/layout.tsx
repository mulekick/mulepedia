/* eslint-disable no-shadow, node/prefer-global/console, react/prop-types, react/react-in-jsx-scope */

// import modules
import Head from "next/head.js";
import Link from "next/link.js";
import Image from "next/image.js";

// import modules
import React from "react";

// declare interfaces
interface PropsSignature {
    index:boolean,
    title:string,
    description:string,
    outletComponent:React.JSX.Element
}

const
    // app layout component
    Layout = (props:PropsSignature):React.JSX.Element => {
        const
            // extract props
            {index, title, description, outletComponent} = props;

        // return component
        return <>
            <Head>
                <title>{ title }</title>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Web site powered by next.js" />
            </Head>
            <header>
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
                { index ? <span className="page-title">This is the home page</span> : <Link className="page-title" href={ `/` }>Back to the home page</Link> }
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
            </header>
            {/* the nav + container pattern has to be implemented here */}
            <main>
                <div className="current-page">
                    <span>{ description }</span>
                    <Link href={ `https://github.com/mulekick/mulepedia` }>
                        <Image src="/gh-logo.png" height={ 25 } width={ 25 } alt="view on github" />
                    </Link>
                </div>
                {
                    // display the component for the current route ...
                    outletComponent
                }
            </main>
        </>;
    };

// export component
export default Layout;