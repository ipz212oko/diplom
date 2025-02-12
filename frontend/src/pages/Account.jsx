import {
  Box,
  Container,
  Heading,
  Text,
  DataList,
  Flex,
  useBreakpointValue
} from "@chakra-ui/react";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { useApi } from "@/hooks/useApi.js";
import { UserAvatar } from "@/features/account/user-avatar/UserAvatar.jsx";
import { CVFile } from "@/features/account/cvFile/CVFile.jsx";
import { UserSkills } from "@/features/account/user-skills/UserSkills.jsx";
import { Loader } from "@/components/ui/loader.jsx";
import { EditForm } from "@/features/account/edit-form/EditForm.jsx";

export function Account() {
  const { user } = useAuth();
  const dataListOrientation = useBreakpointValue({ base: "vertical", md: "horizontal" });

  const { data: userData, loading } = useApi(`/users/${user.id}`);
  const { data: skillsList, loading: loadingSkills } = useApi(`/skills`);

  if (loading || loadingSkills) return <Loader h={64}/>;

  const { file, skills, image } = userData;

  const normalizeSkills = (items) => items.map(({ id, title }) => ({ label: title, value: id }));

  const normalizedUserSkills = normalizeSkills(skills);
  const normalizedSkillsList = normalizeSkills(skillsList.skills);

  return (
    <Container>
      <Heading size="3xl" py={4}>Особисті дані</Heading>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        p={8}
        bg="white"
        shadow="sm"
        rounded="xl"
        gap={4}
      >
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          <UserAvatar image={image}/>
          <Box>
            <Text fontWeight="bold" fontSize="3xl" textTransform="capitalize">{userData.name} {userData.surname}</Text>
            <DataList.Root mt={4} orientation={dataListOrientation}>
              <DataList.Item>
                <DataList.ItemLabel fontSize="md" fontWeight="bold">Пошта:</DataList.ItemLabel>
                <DataList.ItemValue>{userData.email}</DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="md" fontWeight="bold">Навички:</DataList.ItemLabel>
                <DataList.ItemValue>
                  <UserSkills userSkills={normalizedUserSkills} skillsList={normalizedSkillsList} />
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="md" fontWeight="bold">Резюме:</DataList.ItemLabel>
                <DataList.ItemValue>
                  <CVFile file={file}/>
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="md" fontWeight="bold">Регіон:</DataList.ItemLabel>
                <DataList.ItemValue>
                  {userData?.region?.name || "-"}
                </DataList.ItemValue>
              </DataList.Item>
              <DataList.Item>
                <DataList.ItemLabel fontSize="md" fontWeight="bold">Про себе:</DataList.ItemLabel>
                <DataList.ItemValue>
                  {userData.description || "-"}
                </DataList.ItemValue>
              </DataList.Item>
            </DataList.Root>
          </Box>
        </Flex>
        <EditForm data={userData}/>
      </Flex>
    </Container>
  )
}