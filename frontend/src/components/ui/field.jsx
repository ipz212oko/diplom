import { Field as ChakraField, Input } from "@chakra-ui/react";
import { useFormContext } from 'react-hook-form';
import * as React from 'react'

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

export const InputField = function ({ label, type = 'text',  name, ...rest }) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message;

  return (
    <Field label={label} errorText={error}>
      <Input {...register(name)} {...rest} />
    </Field>
  )
}