import { Center, HStack, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import TechnicianCard from "./TechnicianCard";
import ModalCreateTechnician from "./ModalCreateTechnician";

export default function ManageTechnician({
  departmentId,
  emailPIC,
}: {
  departmentId: number;
  emailPIC: string | null | undefined;
}) {

  const technicians = api.user.getUserByDepartmentId.useQuery({
    departmentId: departmentId,
  });

  return (
    <Stack>
      <HStack justify="space-between" w="100%">
        <Text {...fontStyle.heading6bold}>
          Technician List
        </Text>
        <ModalCreateTechnician departmentId={departmentId} />
      </HStack>
      {!technicians.data?.length ? (
        <Skeleton
          isLoaded={technicians.isFetched}
          borderRadius="10px"
          w="100%"
        >
          <Center
            w="100%"
            p="40px"
          >
            No technician in this department yet...
          </Center>
        </Skeleton>
      ) : (
        <SimpleGrid
          columns={[2, 2, 4]}
          spacing="20px"
        >
          {technicians.data.map(technician => (
            <TechnicianCard
              phoneNumber={technician.phoneNumber ?? ""}
              isPIC={emailPIC === technician.email}
              email={technician.email}
              name={technician.name}
              key={technician.id}
              id={technician.id}
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}