import { FunctionComponent } from 'react';
import { Heading, Box } from '@chakra-ui/react';

import { Layout } from 'components';
import { Drawings } from 'features/drawings';

const IndexPage: FunctionComponent = () => {
  return (
    <Layout title="Home">
      <Heading mb={4}>Welcome to Drawshare</Heading>
      <Box mb={8}>Check out some public drawings from our artists.</Box>
      <Drawings />
    </Layout>
  );
};

export default IndexPage;
