import { FunctionComponent, ReactElement } from "react";
import NextLink from "next/link";
import { Box, Link } from "@chakra-ui/react";

import { useAuthContext } from "contexts/auth";
import { Draw } from "features/draw";

type AuthenticatedOnlyProps = {
  children: ReactElement;
};

export const AuthenticatedOnly: FunctionComponent<AuthenticatedOnlyProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated)
    return (
      <Box>
        Please{" "}
        <NextLink href="/auth/login" passHref>
          <Link color="teal.500">sign in</Link>
        </NextLink>{" "}
        or{" "}
        <NextLink href="/auth/register" passHref>
          <Link color="teal.500">create an account</Link>
        </NextLink>{" "}
        to draw.
      </Box>
    );

  return children;
};
