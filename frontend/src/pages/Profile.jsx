import { Avatar, Container, Flex, VStack, Text, Separator, HStack, Badge, Link as BaseLink } from "@chakra-ui/react";
import { LuExternalLink, LuUserRound } from "react-icons/lu";
import { Link, Navigate, useParams } from "react-router";
import { useApi } from "@/hooks/useApi.js";
import { Loader } from "@/components/ui/loader.jsx";
import { Rating } from "@/components/ui/rating.jsx";

export function Profile() {
  const { id } = useParams();
  const { data: userData, loading, error } = useApi(`/users/${id}`);

  if (loading) return <Loader h={64}/>;

  if (error?.statusCode === 404) return <Navigate to='/not-found' />;

  const { surname, name, region, rating, skills, description, role, file } = userData;
  let roleName = null;

  if (role === "creator") roleName = "Розробник";
  if (role === "customer") roleName = "Замовник";

  return (
    <Container py={8}>
      <Flex flexDirection={{ base: "column", md: "row" }} gap={8}>
        <Avatar.Root boxSize="200px" mx="auto">
          <Avatar.Fallback asChild w="50%" h="50%"><LuUserRound/></Avatar.Fallback>
          <Avatar.Image src={null} />
        </Avatar.Root>
        <VStack align="start" flex="1 1 auto">
          <Text textStyle="3xl" fontWeight="bold" textTransform="capitalize">{surname} {name}</Text>
          <HStack separator={<Separator orientation="vertical" height={5} borderColor="gray.600" />}>
            <HStack>
              <Rating readOnly defaultValue={rating} />
              <Text fontWeight="bold" lineHeight="normal">{rating}</Text>
            </HStack>
            {roleName && <Text>{roleName}</Text>}
            {region?.name && <Text>{region?.name}</Text>}
          </HStack>
          <VStack align="start" gap={1} mt={2}>
            <Text textStyle="lg" fontWeight="bold">Навички</Text>
            <Flex flexWrap="wrap" gap={2}>
              {skills.length ? (
                skills.map(({ id, title }) => <Badge key={id} size="lg" variant="outline">{title}</Badge>)
              ) : (
                <Text>Не вказано</Text>
              )}
            </Flex>
          </VStack>
          <VStack align="start" gap={1} mt={2}>
            <Text textStyle="lg" fontWeight="bold">Про мене</Text>
            <Text>{description || "Не вказано"}</Text>
          </VStack>
          {file && (
            <VStack align="start" gap={1} mt={2}>
              <Text textStyle="lg" fontWeight="bold">Резюме</Text>
              <BaseLink as={Link} to={`/${file}`} colorPalette="blue">Переглянути <LuExternalLink /></BaseLink>
            </VStack>
          )}
        </VStack>
      </Flex>
    </Container>
  )
}