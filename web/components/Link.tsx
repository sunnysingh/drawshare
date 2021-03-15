import { FunctionComponent, ReactNode } from 'react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

type LinkProps = {
  href: string;
  children: ReactNode;
};

export const Link: FunctionComponent<LinkProps> = ({ href, children }) => {
  return (
    <NextLink href={href} passHref>
      <ChakraLink color="teal.500">{children}</ChakraLink>
    </NextLink>
  );
};
