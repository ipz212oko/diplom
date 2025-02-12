import { Field as ChakraField, Input, Textarea } from "@chakra-ui/react";
import { useFormContext } from 'react-hook-form';
import * as React from 'react'
import { PasswordInput } from "@/components/ui/password-input.jsx";

export const Field = React.forwardRef(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, ...rest } =
    props
  return (
    <ChakraField.Root ref={ref} invalid={errorText} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  )
})

export const FormField = function ({ label, type = 'text',  name, component: Component, ...rest }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <Field label={label} errorText={error}>
      <Component {...register(name)} {...rest} />
    </Field>
  )
}

export const InputField = (props) => <FormField component={Input} {...props}/>;
export const PasswordField = (props) => <FormField component={PasswordInput} {...props}/>;
export const TextField = (props) => <FormField component={Textarea} {...props}/>;