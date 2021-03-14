import { FunctionComponent, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Alert,
  AlertDescription
} from "@chakra-ui/react";
import { useFormik } from "formik";

import { Layout } from "components";
import { api } from "api";

const RegisterPage: FunctionComponent = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, actions) => {
      setError('');
      await api
        .service("users")
        .create(values)
        .then(() => {
          router.push("/dashboard");
        })
        .catch((error: Error) => {
          actions.setSubmitting(false);
          setError(error.message);
        });
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
            <FormLabel>Email</FormLabel>
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

          {error && (
            <Alert status="error" mb={4}>
            <AlertDescription>{error}}</AlertDescription>
          </Alert>
          )}

          <Button type="submit" isLoading={formik.isSubmitting}>
            Register
          </Button>
        </form>
      </Container>
    </Layout>
  );
};

export default RegisterPage;
