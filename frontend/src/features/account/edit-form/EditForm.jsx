import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.jsx";
import { Button, Flex, Stack, Text } from "@chakra-ui/react";
import { LuPen } from "react-icons/lu";
import { InputField, TextField } from "@/components/ui/field.jsx";
import { Form, Submit } from "@/components/ui/form.jsx";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FieldController } from "@/components/ui/field-controller.jsx";
import { validationSchema } from "@/features/account/edit-form/formValidation.js";
import { axiosInstance } from "@/utils/axiosInstance.js";
import { useApi } from "@/hooks/useApi.js";
import { SearchSelect } from "@/components/search-select/SearchSelect.jsx";

export function EditForm({ data }) {
  const { data: regionsList } = useApi(`/regions`, { defaultValue: [] });

  const contentRef = useRef(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const normalizedRegions = useMemo(() => {
    const regions = regionsList?.regions;

    if(!regions) return [];

    return regions.map(({ id, name }) => ({ label: name, value: id }))
  }, [regionsList]);

  const onSubmit = async (userData) => {
    setError(null);

    try {
      await axiosInstance.patch(`/users/${data.id}`, userData);
      navigate(0);
    } catch(error) {
      setError(error.message);
    }
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
         <LuPen/> Редагувати
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Редагування акаунту</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <Form
            onSubmit={onSubmit}
            validation={validationSchema}
            options={{
              defaultValues: {
                name: data.name,
                surname: data.surname,
                region: data?.region?.id ? [data?.region?.id] : [],
                description: data.description || '',
              }
            }}
          >
            <Stack spacing={2} alignItems="center">
              <InputField name="name" label="Ім'я" />
              <InputField name="surname" label="Прізвище" />
              <FieldController name="region">
                {({ field }) => {
                  return (
                    <SearchSelect
                      name={field.name}
                      items={normalizedRegions}
                      value={field.value}
                      label="Країна"
                      allowCustomValue={false}
                      onValueChange={({ value }) => field.onChange(value)}
                    />
                  )
                }}
              </FieldController>
              <TextField name="description" label="Про себе" h={32} />
            </Stack>
            {error && <Text mt={2} color="red" fontSize="sm">{error}</Text>}
            <Flex justify="center" mt={4}>
              <Submit colorPalette="blue">Зберегти</Submit>
            </Flex>
          </Form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}