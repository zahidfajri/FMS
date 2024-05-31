import { Button, HStack, Select, Stack, Text, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useState } from "react";
import { fontStyle } from "~/styles/fontStyle"
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function DetailTicketDepartment({
  ticketId,
  currentDepartmentId,
}: {
  ticketId: number;
  currentDepartmentId: number | null;
}) {
  const router = useRouter();
  const toast = useToast();

  const isMoving = useBooleanState();
  const fetchUpdateDepartment = api.ticket.updateTicketDepartment.useMutation();
  const departments = api.department.departments.useQuery();
  const [departmentId, setDepartmentId] = useState(currentDepartmentId ? currentDepartmentId.toString() : "");

  async function onMove() {
    if (!departmentId) return;
    isMoving.set(true);
    const response = await fetchUpdateDepartment.mutateAsync({
      ticketId,
      departmentId: Number(departmentId),
    });
    isMoving.set(false);
    if (!response?.id) return;
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    router.replace("/astraforger/dashboard");
  }
  return (
    <Stack>
      <Text {...fontStyle.body1bold}>
        Move to another department?
      </Text>
      <HStack>
        <Select
          onChange={e => setDepartmentId(e.target.value)}
          placeholder="Select department"
          value={departmentId}
          w="100%"
        >
          {departments.data?.map((department) => (
            <option value={department.id} key={department.id}>
              {department.name}
            </option>
          ))}
        </Select>
        <Button
          colorScheme={departmentId && Number(departmentId) !== currentDepartmentId ? "blue" : undefined}
          isLoading={isMoving.get}
          onClick={onMove}
        >
          Move
        </Button>
      </HStack>
    </Stack>
  )
}