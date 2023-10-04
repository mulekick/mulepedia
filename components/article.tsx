/* eslint-disable react/prop-types, react/react-in-jsx-scope */

// import modules
import React from "react";

// declare interfaces
interface PropsSignature {
    data:{htmlContents:string}
}

const
    // page component
    Article = (props:PropsSignature):React.JSX.Element => {
        const
            // extract props
            {data} = props,
            // read data
            {htmlContents} = data;

        // return component
        return <article className="markdown-body" dangerouslySetInnerHTML={{__html: htmlContents}} />;
    };

// export component
export default Article;