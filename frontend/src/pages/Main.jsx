import {
  Button,
  HStack,
  Image,
  SimpleGrid,
  Card,
  Box,
  Text,
  Heading,
  Center, Container
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
    <Container>
      <HStack gap={4} py={10}>
        <Card.Root as={Link} to="/creators" flex="1">
          <Card.Body
            as={Center}
            gap={4}
            p={4}
            py={20}
            px={4}
            fontSize="xl"
            fontWeight="bold"
            transition="shadow"
            _hover={{
              shadow: "xl",
            }}
          >
            <Image width={250} src={ordersImage} alt="Замовникам" />
            Замовникам
          </Card.Body>
        </Card.Root>
        <Card.Root as={Link} to="/orders" flex="1">
          <Card.Body
            as={Center}
            gap={4}
            p={4}
            py={20}
            px={4}
            fontSize="xl"
            fontWeight="bold"
            transition="shadow"
            _hover={{
              shadow: "xl",
            }}
          >
            <Image width={250} src={creatorsImage} alt="Виконавцям" />
            Виконавцям
          </Card.Body>
        </Card.Root>
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
    </Container>
  )
}