/* eslint-disable no-shadow, node/prefer-global/console, react/prop-types, react/react-in-jsx-scope */

// import modules
import Head from "next/head.js";
import Link from "next/link.js";
import Image from "next/image.js";

const
    // app layout component
    Layout = props => {
        const
            // extract props
            {page, outletComponent} = props;

        // return component
        return <>
            <Head>
                <title>Next.js documentation website</title>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="description" content="Web site powered by next.js" />
            </Head>
            <header>
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
                <Link href={ `/` }>Back to home page</Link>
                <Image src="/hackermans.png" height={ 75 } width={ 75 } alt="Everyday" />
            </header>
            {/* the nav + container pattern has to be implemented here */}
            <main>
                <p className="current-page">{ page }</p>
                {
                    // display the component for the current route ...
                    outletComponent
                }
            </main>
        </>;
    };

// export component
export default Layout;