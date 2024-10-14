// import modules
import React from "react";

// import interfaces
import {ContentProps} from "../lib/interfaces.ts";

const
    // page component
    Content = (props: ContentProps): React.JSX.Element => {
        const
            // extract props
            {data} = props,
            // read data
            {htmlContents} = data;

        // return component
        return (
            <section className={ `markdown-body` } dangerouslySetInnerHTML={ {__html: htmlContents} } />
        );
    };

// export component
export default Content;