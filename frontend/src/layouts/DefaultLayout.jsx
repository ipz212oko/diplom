import { Outlet } from "react-router";
import { Box, Container } from "@chakra-ui/react";
import { Header } from "@/components/header/Header.jsx";

export function DefaultLayout() {
  return (
    <Box>
      <Header />
      <Box as="main">
        <Container>
          <Outlet/>
        </Container>
      </Box>
    </Box>
  )
}