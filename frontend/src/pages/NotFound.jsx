import { Button, Center, HStack, Text, Image } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router";
import NotFoundImage from "@/assets/images/404.svg";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Center position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" flexDirection="column">
      <Image src={NotFoundImage} w={400} h={300} alt="Сторінку не знайдено"/>
      <Text mt={2} fontWeight="bold" fontSize="xl">Сторінку не знайдено</Text>
      <HStack mt={8}>
        <Button variant="outline" onClick={() => navigate(-1)}>Повернутись назад</Button>
        <Button as={Link} to="/" colorPalette="blue">На головну</Button>
      </HStack>
    </Center>
  )
}