// import modules
import React from "react";

// general interfaces

interface HTMLContents {
    htmlContents:string;
}

// files interfaces
export interface FileRelativePath {
    params:{file:Array<string>}
}

export interface FileMetadata {
    relativePath:string;
    title:string;
    description:string;
    keywords:string;
    index:number;
    publish:boolean;
}

export interface PageContents extends FileMetadata, HTMLContents {
    canonicalUrl:string|null;
    htmlContents:string;
}

// components interfaces
export interface EmptyProps {}

export interface LayoutProps {
    homepage:boolean,
    // seo
    title:string,
    description:string,
    keywords:string;
    canonicalUrl:string|null;
    // component
    outletComponent:React.JSX.Element
}

export interface ContentProps {
    data:{htmlContents:string}
}

// pages interfaces
export interface HomePageProps extends HTMLContents {
    canonicalUrl:string
}

export interface NotFoundPageProps extends HTMLContents {}

export interface DocumentationPageProps {
    data:PageContents
}