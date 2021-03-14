import { FunctionComponent, ReactNode } from "react";

import { Head, Nav } from "./index";

type LayoutProps = {
  children: ReactNode;
  title: string;
};

export const Layout: FunctionComponent<LayoutProps> = ({ children, title }) => (
  <>
    <Head title={title} />
    <Nav />
    <main>{children}</main>
  </>
);
