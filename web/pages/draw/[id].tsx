import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Heading, Box } from '@chakra-ui/react';

import { Layout, AuthenticatedOnly } from 'components';

import { DrawingDetail } from 'features/drawings';

const DrawDetailPage: FunctionComponent = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Layout title="Private Drawing">
      <Heading as="h1" size="lg" mb={4}>
        Private Drawing
      </Heading>
      <Box mb={4}>
        This drawing is not visible in the gallery, but anyone with access to
        this URL can see it.
      </Box>
      <AuthenticatedOnly>
        <DrawingDetail id={id} />
      </AuthenticatedOnly>
    </Layout>
  );
};

export default DrawDetailPage;
