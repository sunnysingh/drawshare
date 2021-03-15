import { FunctionComponent } from 'react';
import { Heading, Box } from '@chakra-ui/react';

import { Layout } from 'components';
import { DrawingsList } from 'features/drawings';

const PrivateDrawingsPage: FunctionComponent = () => {
  return (
    <Layout title="Your Private Drawings">
      <Heading mb={4}>Your Private Drawings</Heading>
      <Box mb={8}>Some things the world is not ready for yet.</Box>
      <DrawingsList isPublic={false} />
    </Layout>
  );
};

export default PrivateDrawingsPage;
