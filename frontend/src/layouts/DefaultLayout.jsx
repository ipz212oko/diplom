import { Outlet } from "react-router";
import { Box } from "@chakra-ui/react";
import { Header } from "@/components/header/Header.jsx";

export function DefaultLayout() {
  return (
    <Box display="flex" flexDirection="column" minH="full">
      <Header />
      <Box as="main" display="flex" flexDirection="column" flex="1">
        <Outlet/>
      </Box>
    </Box>
  )
}