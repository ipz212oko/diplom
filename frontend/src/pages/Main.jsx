import {
  Button,
  HStack,
  Image,
  SimpleGrid,
  Card,
  Box,
  Text,
  Heading,
  Center
} from "@chakra-ui/react";
import { Link } from "react-router";
import ordersImage from "@/assets/images/orders.svg";
import creatorsImage from "@/assets/images/creators.svg";

const popularSkills = [
  {
    id: 1,
    name: "Веб-програмування",
    img: creatorsImage
  },
  {
    id: 2,
    name: "Веб-програмування Веб-програмування",
    img: creatorsImage
  },
  {
    id: 3,
    name: "Веб-програмування",
    img: creatorsImage
  },
  {
    id: 4,
    name: "Веб-програмування",
    img: creatorsImage
  }
];

export function Main() {
  return (
    <>
      <HStack gap={4} py={10}>
        <Button
          as={Link}
          to="/creators"
          variant="plain"
          display="flex"
          flex="1"
          flexDirection="column"
          h="auto"
          py={20}
          px={4}
          fontSize="xl"
          fontWeight="bold"
          bg="white"
          shadow="md"
          _hover={{
            shadow: "xl",
          }}
        >
          <Image width={250} src={ordersImage} alt="Замовникам" />
          Замовникам
        </Button>
        <Button
          as={Link}
          to="/orders"
          variant="plain"
          display="flex"
          flex="1"
          flexDirection="column"
          h="auto"
          py={20}
          px={4}
          fontSize="xl"
          fontWeight="bold"
          bg="white"
          shadow="md"
          _hover={{
            shadow: "xl",
          }}
        >
          <Image width={250} src={creatorsImage} alt="Виконавцям" />
          Виконавцям
        </Button>
      </HStack>
      <Box py={10}>
        <Heading size="4xl" fontFamily="inherit" textAlign="center">Популярні напрямки</Heading>
        <SimpleGrid columns={[1, 2, 3, 4]} gap={4} mt={8}>
          {popularSkills.map(({ id, name, img }) => (
            <Card.Root as={Link} key={id} h="256px" transition="shadow" _hover={{ shadow: "xl" }}>
              <Card.Body as={Center} gap={4} p={4}>
                <Image src={img} w="100px" h="100px"/>
                <Text fontWeight="bold" textAlign="center">{name}</Text>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
      </Box>
    </>
  )
}