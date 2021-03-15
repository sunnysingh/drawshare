import { FunctionComponent } from "react";
import { Heading } from "@chakra-ui/react";

import { Layout, AuthenticatedOnly } from "components";
import { Draw } from "features/draw";

const DrawPage: FunctionComponent = () => {
  return (
    <Layout title="Draw">
      <Heading as="h1" size="lg" mb={4}>
        Draw
      </Heading>
      <AuthenticatedOnly>
        <Draw />
      </AuthenticatedOnly>
    </Layout>
  );
};

export default DrawPage;
