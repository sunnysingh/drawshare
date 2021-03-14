import { FunctionComponent, ReactNode } from "react";
import { Box, Container } from "@chakra-ui/react";

import { Head, Nav } from "./index";

type LayoutProps = {
  children: ReactNode;
  title: string;
};

export const Layout: FunctionComponent<LayoutProps> = ({ children, title }) => (
  <>
    <Head title={title} />
    <Nav />
    <Container maxW="container.xl">
      <Box py={4} as="main">
        {children}
      </Box>
    </Container>
  </>
);
