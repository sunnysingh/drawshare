import { FunctionComponent, ReactNode } from 'react';
import { Box, Container } from '@chakra-ui/react';

import { AuthProvider } from 'contexts/auth';

import { Head, Nav } from './index';

type LayoutProps = {
  children: ReactNode;
  title: string;
};

/**
 * A common layout to be used by all pages.
 */
export const Layout: FunctionComponent<LayoutProps> = ({ children, title }) => (
  <>
    <Head title={title} />
    <AuthProvider>
      <Nav />
      <Container maxW="container.xl">
        <Box py={4} as="main">
          {children}
        </Box>
      </Container>
    </AuthProvider>
  </>
);
