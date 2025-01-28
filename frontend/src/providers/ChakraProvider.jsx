import { ChakraProvider as BaseChakraProvider, defaultSystem } from '@chakra-ui/react'

export function ChakraProvider({ children }) {
  return (
    <BaseChakraProvider value={defaultSystem}>
      {children}
    </BaseChakraProvider>
  )
}
