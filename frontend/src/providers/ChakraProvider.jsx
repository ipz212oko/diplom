import { ChakraProvider as BaseChakraProvider } from '@chakra-ui/react'
import { system } from "@/config/theme.js";

export function ChakraProvider({ children }) {
  return (
    <BaseChakraProvider value={system}>
      {children}
    </BaseChakraProvider>
  )
}
