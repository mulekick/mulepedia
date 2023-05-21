/* eslint-disable react/prop-types, react/react-in-jsx-scope */

const
    // page component
    Article = props => {
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