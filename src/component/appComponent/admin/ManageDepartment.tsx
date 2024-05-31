import { Center, HStack, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import ModalCreateDepartment from "./ModalCreateDepartment";
import { useSetRecoilState } from "recoil";
import { selectedDepartmentRecoil } from "~/utils/recoil";
import { LS_SELECTED_DEPARTMENT } from "~/utils/constant";

export default function ManageDepartment() {

  const departments = api.department.departments.useQuery();
  const setSelectedDepartment = useSetRecoilState(selectedDepartmentRecoil);

  function onSelectDepartment(name: string, id: number) {
    const temp = { name, id, };
    setSelectedDepartment(temp);
    localStorage.setItem(LS_SELECTED_DEPARTMENT, JSON.stringify(temp))
    return;
  }

  return (
    <Stack>
      <HStack w="100%" justify="space-between">
        <Text {...fontStyle.heading6bold}>
          Department
        </Text>
        <ModalCreateDepartment />
      </HStack>
      {!departments.data?.length ? (
        <Skeleton
          isLoaded={departments.isFetching === false}
          borderRadius="10px"
          w="100%"
        >
          <Center
            w="100%"
            p="40px"
          >
            No department found! Try to create department.
          </Center>
        </Skeleton>
      ) : (
        <SimpleGrid
          columns={[2, 3, 4]}
          spacing="20px"
        >
          {departments.data.map(department => (
            <Stack
              _hover={{
                bgColor: "gray.50",
              }}
              onClick={() => onSelectDepartment(department.name, department.id)}
              borderRadius="10px"
              key={department.id}
              borderWidth="1px"
              userSelect="none"
              cursor="pointer"
              spacing="5px"
              p="10px"
            >
              <Text
                {...fontStyle.heading6bold}
                noOfLines={1}
              >
                {department.name}
              </Text>
              <Text noOfLines={1} color="gray.500">
                {department.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}