import { Controller, useFormContext } from 'react-hook-form';

export const FieldController = function ({children, ...rest}) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      render={data => children(data)}
      {...rest}
    />
  )
}