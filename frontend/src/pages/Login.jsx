import * as yup from "yup"
import { Center, Card, Heading, Button, Stack } from "@chakra-ui/react";
import { InputField } from "@/components/ui/field.jsx";
import { Form } from "@/components/ui/form.jsx";
import { validationMessage } from "@/config/validationMessage.js";

const { REQUIRED, INVALID_EMAIL } = validationMessage;

const validationSchema = yup
  .object({
    email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
    password: yup.string().required(REQUIRED),
  })
  .required()

export function Login() {
  const onSubmit = data => {
    console.log(data);
  }

  return (
    <Center flex="1">
      <Card.Root size="md" maxW="400px" w="full">
        <Form onSubmit={onSubmit} validation={validationSchema}>
          <Card.Header as={Heading} textAlign="center" size="3xl">Вхід</Card.Header>
          <Card.Body>
              <Stack spacing={2} alignItems="center">
                <InputField label="Пошта" name="email" />
                <InputField label="Пароль" name="password" />
              </Stack>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Button type="submit" colorPalette="blue">Увійти</Button>
          </Card.Footer>
        </Form>
      </Card.Root>
    </Center>
  )
}