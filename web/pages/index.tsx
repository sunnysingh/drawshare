import { FunctionComponent } from 'react';
import { Heading } from '@chakra-ui/react';

import { Layout } from 'components';
import { Drawings } from 'features/drawings';

const IndexPage: FunctionComponent = () => {
  return (
    <Layout title="Home">
      <Heading mb={4}>Welcome to Drawshare</Heading>
      <Drawings />
    </Layout>
  );
};

export default IndexPage;
