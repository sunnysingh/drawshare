import NextHead from "next/head";

const Head = ({ title }) => (
  <NextHead>
    <meta charSet="UTF-8" />
    <title>{title} | Drawshare</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/static/favicon.ico" />
  </NextHead>
);

export default Head;
