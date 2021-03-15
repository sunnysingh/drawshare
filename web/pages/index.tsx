import { FunctionComponent } from 'react';
import { Heading, Box } from '@chakra-ui/react';

import { Layout } from 'components';
import { DrawingsList } from 'features/drawings';

const IndexPage: FunctionComponent = () => {
  return (
    <Layout title="Home">
      <Heading mb={4}>Welcome to Drawshare</Heading>
      <Box mb={8}>Check out some recent public drawings from our artists.</Box>
      <DrawingsList />
    </Layout>
  );
};

export default IndexPage;
