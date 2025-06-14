// import modules
import React from "react";

// import types
import type {ContentProps} from "../lib/interfaces.ts";

// page component
const Content = (props: ContentProps): React.JSX.Element => {
    // extract props
    const {data: {htmlContents}} = props;
    // return component
    return <section className={ `markdown-body` } dangerouslySetInnerHTML={ {__html: htmlContents} } />;
};

// export component
export default Content;