import NextHead from 'next/head';
import { FunctionComponent } from 'react';

type HeadProps = {
  title?: string;
};

/**
 * Sets common meta tags, and allows changing title between pages.
 */
export const Head: FunctionComponent<HeadProps> = ({ title }) => {
  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <title>{title} | Drawshare</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/static/favicon.ico" />
    </NextHead>
  );
};
