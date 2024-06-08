import { Center, HStack, SimpleGrid, Skeleton, Stack, Text, Tooltip } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import ModalCreateDepartment from "./ModalCreateDepartment";
import { useRouter } from "next/router";

export default function ManageDepartment() {
  const router = useRouter();
  const departments = api.department.departments.useQuery();

  function onSelectDepartment(id: number) {
    router.push(`/admin/department/${id}`)
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
          columns={[1, 2, 4]}
          spacing="20px"
        >
          {departments.data.map(department => (
            <Tooltip
              label={<>
                {department.name} <br /> <br />
                {department.description}
              </>}
              key={department.id}
              hasArrow
            >
              <Stack
                _hover={{
                  bgColor: "gray.50",
                }}
                onClick={() => onSelectDepartment(department.id)}
                borderRadius="10px"
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
            </Tooltip>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}