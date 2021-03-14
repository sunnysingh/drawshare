import { FunctionComponent } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";

import { Layout } from "components";

const RegisterPage: FunctionComponent = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Layout title="Register">
      <Container>
        <Heading as="h1" size="lg" mb={4}>
          Create an account
        </Heading>
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="email" mb={4}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              required
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </FormControl>
          <Button type="submit">Register</Button>
        </form>
      </Container>
    </Layout>
  );
};

export default RegisterPage;
