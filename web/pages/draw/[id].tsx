import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Heading, Box } from '@chakra-ui/react';

import { Layout, AuthenticatedOnly } from 'components';

import { DrawingDetail } from 'features/drawings';

const DrawDetailPage: FunctionComponent = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Layout title="Drawing">
      <Heading as="h1" size="lg" mb={4}>
        A Drawing
      </Heading>
      <Box mb={4}>Share this drawing with someone! It's a unique URL.</Box>
      <DrawingDetail id={id} />
    </Layout>
  );
};

export default DrawDetailPage;
