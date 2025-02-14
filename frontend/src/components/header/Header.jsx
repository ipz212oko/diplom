import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Link as BaseLink,
  Stack,
  Avatar,
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
import { LuMenu, LuUserRound } from "react-icons/lu";
import { Link } from "react-router";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { MenuContent, MenuItem, MenuRoot, MenuSeparator, MenuTrigger } from "@/components/ui/menu.jsx";
import { Logout } from "@/components/ui/logout.jsx";

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
  const { user } = useAuth();

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
            {user ? (
              <MenuRoot positioning={{ placement: "bottom-end" }}>
                <MenuTrigger outline="none">
                  <Avatar.Root>
                    <Avatar.Fallback asChild><LuUserRound style={{ width: "24px", height: "24px"}}/></Avatar.Fallback>
                    <Avatar.Image src={user?.image} />
                  </Avatar.Root>
                </MenuTrigger>
                <MenuContent>
                  <MenuItem value="account" cursor="pointer" asChild>
                    <Link to="/account">Акаунт</Link>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem value="exit">
                    <Logout size="sm" variant="plain" justifyContent="start" p={0} w="full" h="auto" lineHeight="normal" fontWeight="normal" />
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            ) : (
              <>
                <Button as={Link} to="/login" fontSize="md" variant="ghost">Вхід</Button>
                <Button as={Link} to="/sign-up" fontSize="md" colorPalette="blue">Реєстрація</Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}