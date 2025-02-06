import * as yup from "yup"
import { Center, Card, Heading, Stack, Text } from "@chakra-ui/react";
import { SegmentedControl } from "@/components/ui/segmented-control.jsx";
import { InputField, PasswordField } from "@/components/ui/field.jsx";
import { Form, Submit } from "@/components/ui/form.jsx";
import { validationMessage } from "@/config/validationMessage.js";
import { FieldController } from "@/components/ui/field-controller.jsx";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { useNavigate } from "react-router";
import { useState } from "react";

const { REQUIRED, INVALID_EMAIL, MIN_PASSWORD_LENGTH } = validationMessage;

const validationSchema = yup
  .object({
    role: yup.string().required(REQUIRED),
    name: yup.string().required(REQUIRED),
    surname: yup.string().required(REQUIRED),
    email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
    password: yup.string().min(4, MIN_PASSWORD_LENGTH).required(REQUIRED),
  })
  .required()

export function SignUp() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onSubmit = async (userData) => {
    setError(null);

    try {
      await register(userData);
      navigate("/account");
    } catch(error) {
      setError(error.message);
    }
  }

  return (
    <Center flex="1">
      <Card.Root size="md" maxW="400px" w="full">
        <Form
          options={{
            defaultValues: {
              role: "creator"
            }
          }}
          onSubmit={onSubmit}
          validation={validationSchema}
        >
          <Card.Header as={Heading} textAlign="center" size="3xl">Реєстрація</Card.Header>
          <Card.Body>
              <Stack spacing={2} alignItems="center">
                <FieldController name="role">
                  {({ field }) => (
                    <SegmentedControl
                      w="fit"
                      name={field.name}
                      defaultValue="creator"
                      value={field.value}
                      onValueChange={({ value }) => field.onChange(value)}
                      items={[
                        { value: "creator", label: "Фрілансер" },
                        { value: "customer", label: "Замовник" }
                      ]}
                      mb={4}
                    />
                  )}
                </FieldController>
                <InputField label="Ім'я" name="name" />
                <InputField label="Прізвище" name="surname" />
                <InputField label="Пошта" name="email" />
                <PasswordField label="Пароль" name="password" />
              </Stack>
              {error && <Text mt={2} color="red" fontSize="sm">{error}</Text>} 
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Submit colorPalette="blue">Зареєструватися</Submit>
          </Card.Footer>
        </Form>
      </Card.Root>
    </Center>
  )
}