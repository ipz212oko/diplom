import { Center, Spinner } from "@chakra-ui/react";

export function Loader(props) {
  return (
    <Center {...props}>
      <Spinner size="xl" borderWidth="4px" />
    </Center>
  )
}