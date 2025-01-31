import { ChakraProvider as BaseChakraProvider } from '@chakra-ui/react'
import { system } from "@/config/theme.js";
import { ColorModeProvider } from "@/components/ui/color-mode.jsx";

export function ChakraProvider({ children }) {
  return (
    <BaseChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </BaseChakraProvider>
  )
}
