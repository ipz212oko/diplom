import {
  Button,
  HStack,
  Image
} from "@chakra-ui/react";
import { Link } from "react-router";
import ordersImage from "@/assets/images/orders.svg";
import creatorsImage from "@/assets/images/creators.svg";

export function Main() {
  return (
    <>
      <HStack gap={4} py={10}>
        <Button as={Link} to="/creators" variant="outline" display="flex" flex="1" flexDirection="column" h="auto" py={20} px={4} fontSize="xl" fontWeight="bold">
          <Image width={250} src={ordersImage} alt="Замовникам" />
          Замовникам
        </Button>
        <Button as={Link} to="/orders" variant="outline" display="flex" flex="1" flexDirection="column" h="auto" py={20} px={4} fontSize="xl" fontWeight="bold">
          <Image width={250} src={creatorsImage} alt="Виконавцям" />
          Виконавцям
        </Button>
      </HStack>
    </>
  )
}