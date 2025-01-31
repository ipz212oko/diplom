import * as yup from "yup"
import { Center, Card, Heading, Button, Stack } from "@chakra-ui/react";
import { SegmentedControl } from "@/components/ui/segmented-control.jsx";
import { InputField } from "@/components/ui/field.jsx";
import { Form } from "@/components/ui/form.jsx";
import { validationMessage } from "@/config/validationMessage.js";
import { FieldController } from "@/components/ui/field-controller.jsx";

const { REQUIRED, INVALID_EMAIL } = validationMessage;

const validationSchema = yup
  .object({
    role: yup.string().required(REQUIRED),
    name: yup.string().required(REQUIRED),
    surname: yup.string().required(REQUIRED),
    email: yup.string().email(INVALID_EMAIL).required(REQUIRED),
    password: yup.string().required(REQUIRED),
  })
  .required()

export function SignUp() {
  const onSubmit = data => {
    console.log(data);
  }

  return (
    <Center flex="1">
      <Card.Root size="md" maxW="400px" w="full">
        <Form onSubmit={onSubmit} validation={validationSchema}>
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
                <InputField label="Пароль" name="password" />
              </Stack>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Button type="submit" colorPalette="blue">Зареєструватися</Button>
          </Card.Footer>
        </Form>
      </Card.Root>
    </Center>
  )
}