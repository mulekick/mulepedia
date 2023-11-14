// import modules
import React from "react";

// declare interfaces
interface PropsSignature {
    data:{htmlContents:string}
}

const
    // page component
    Content = (props:PropsSignature):React.JSX.Element => {
        const
            // extract props
            {data} = props,
            // read data
            {htmlContents} = data;

        // return component
        return <section className="markdown-body" dangerouslySetInnerHTML={{__html: htmlContents}} />;
    };

// export component
export default Content;