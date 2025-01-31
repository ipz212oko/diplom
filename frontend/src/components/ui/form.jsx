import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup"

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