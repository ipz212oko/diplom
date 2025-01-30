import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link as BaseLink,
  Stack
} from "@chakra-ui/react";
import {
  DrawerBackdrop,
  DrawerBody, DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { LuMenu } from "react-icons/lu";
import { Link } from "react-router";

function NavLinks(props) {
  return (
    <Stack direction={{ base: "column", md: "row" }} as="nav" gap={{ base: 4, md: 8 }} {...props}>
      <BaseLink as={Link} to="/" fontWeight="medium">Головна</BaseLink>
      <BaseLink as={Link} to="/customers" fontWeight="medium">Замовникам</BaseLink>
      <BaseLink as={Link} to="/orders" fontWeight="medium">Виконавцям</BaseLink>
    </Stack>
  )
}

export function Header() {
  return (
    <Box as="header" position="sticky" top={0} w="full" bg="white" shadow="sm" zIndex={999}>
      <Container>
        <Flex py={4}>
          <NavLinks hideBelow="md" />
          <DrawerRoot placement="start">
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button variant="plain" hideFrom="md" size="sm" p={1}>
                <LuMenu style={{ width: "32px", height: "32px"}} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px" borderBottomColor="gray.200">
                <DrawerTitle>Меню</DrawerTitle>
                <DrawerCloseTrigger />
              </DrawerHeader>
              <DrawerBody pt={4}>
                <NavLinks/>
              </DrawerBody>
            </DrawerContent>
          </DrawerRoot>
          <HStack ml="auto">
            <Button as={Link} to="/login" fontSize="md" variant="ghost">Вхід</Button>
            <Button as={Link} to="/register" fontSize="md" colorPalette="blue">Реєстрація</Button>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}