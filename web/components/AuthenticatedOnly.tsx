import { FunctionComponent, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

import { Link } from 'components';
import { useAuthContext } from 'contexts/auth';

export const AuthenticatedOnly: FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated)
    return (
      <Box>
        Please <Link href="/auth/login">sign in</Link> or{' '}
        <Link href="/auth/register">create an account</Link> to draw.
      </Box>
    );

  return <>{children}</>;
};
