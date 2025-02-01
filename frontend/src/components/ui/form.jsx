import { FormProvider, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@chakra-ui/react";

export function Form({ children, onSubmit, validation, options = {}, ...rest }) {
  if(validation) {
    options.resolver = yupResolver(validation);
  }

  const methods = useForm(options);

  const submit = onSubmit ? methods.handleSubmit(onSubmit) : null;

  return (
    <FormProvider {...methods}>
      <form onSubmit={submit} {...rest}>
        {children}
      </form>
    </FormProvider>
  );
}

export function Submit({ children, ...rest }) {
  const { isSubmitting } = useFormState();

  return (
    <Button type="submit" disabled={isSubmitting} {...rest}>{children}</Button>
  )
}
