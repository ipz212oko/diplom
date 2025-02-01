import * as yup from "yup"
import { Center, Card, Heading, Stack } from "@chakra-ui/react";
import { InputField, PasswordField } from "@/components/ui/field.jsx";
import { Form, Submit } from "@/components/ui/form.jsx";
import { validationMessage } from "@/config/validationMessage.js";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { useNavigate } from "react-router";

const { REQUIRED, INVALID_EMAIL } = validationMessage;

const validationSchema = yup
  .object({
    email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
    password: yup.string().required(REQUIRED),
  })
  .required()

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (userData) => {
    try {
      await login(userData);
      navigate("/");
    } catch(error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Center flex="1">
      <Card.Root size="md" maxW="400px" w="full">
        <Form onSubmit={onSubmit} validation={validationSchema}>
          <Card.Header as={Heading} textAlign="center" size="3xl">Вхід</Card.Header>
          <Card.Body>
            <Stack spacing={2} alignItems="center">
              <InputField label="Пошта" name="email" />
              <PasswordField label="Пароль" name="password" />
            </Stack>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Submit colorPalette="blue">Увійти</Submit>
          </Card.Footer>
        </Form>
      </Card.Root>
    </Center>
  )
}