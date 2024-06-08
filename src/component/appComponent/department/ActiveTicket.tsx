import { Button, Center, HStack, Select, SimpleGrid, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import TicketCard, { SelectableTicketCard } from "../admin/TicketCard";
import { useBooleanState } from "~/utils/hooks";
import { useState } from "react";

export default function ActiveTicket({
  departmentId,
  isTechnician = false,
}: {
  departmentId: number;
  isTechnician?: boolean;
}) {

  const activeTickets = api.ticket.getActiveTicketsByDepartment.useQuery({
    departmentId: departmentId,
  });
  const displayedTicket = activeTickets.data ?? [];

  const toast = useToast();
  const assignMode = useBooleanState();
  const isAssgining = useBooleanState();
  const fetchAssign = api.ticket.bulkAssignTicket.useMutation().mutateAsync;
  const query = api.useContext().ticket.getActiveTicketsByDepartment;
  const query2 = api.useContext().ticket.getCountTicketByUserId;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  function onSelectId(id: number) {
    setSelectedIds(prev => {
      const temp = [...prev];
      const foundIndex = temp.findIndex(e => e === id);
      if (foundIndex === -1) temp.push(id);
      else temp.splice(foundIndex, 1);
      return temp;
    })
  };

  const technicians = api.user.getUserByDepartmentId.useQuery({
    departmentId: departmentId,
  });

  async function onAssign() {
    if (!selectedUserId || !selectedIds.length) return;

    isAssgining.set(true);
    const response = await fetchAssign({
      ticketIds: selectedIds,
      userId: selectedUserId,
    });
    isAssgining.set(false);
    if (!response) {
      toast({
        title: "Something Went Wrong!",
        status: "error",
        position: "top",
      });
      return;
    }
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    setSelectedIds([]);
    query.invalidate();
    query2.invalidate();
  }

  return (
    <Stack>
      <HStack justify="space-between" w="100%">
        <Text {...fontStyle.heading6bold}>
          Active Ticket
        </Text>
        {assignMode.get ? (
          <HStack>
            <Select
              onChange={e => setSelectedUserId(e.target.value)}
              placeholder="Choose Technician"
              value={selectedUserId}
              maxW="200px"
              size="sm"
            >
              {technicians.data?.map(user => (
                <option value={user.id} key={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            <Button
              isLoading={isAssgining.get}
              colorScheme="blue"
              onClick={onAssign}
              size="sm"
            >
              Assign
            </Button>
            <Button
              onClick={() => assignMode.set(e => !e)}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Done
            </Button>
          </HStack>
        ) : (
          <Button
            onClick={() => assignMode.set(e => !e)}
            colorScheme="blue"
            size="sm"
          >
            Bulk Assign
          </Button>
        )}
      </HStack>
      {!displayedTicket.length ? (
        <Skeleton
          isLoaded={activeTickets.isFetched}
          borderRadius="10px"
          w="100%"
        >
          <Center
            w="100%"
            p="40px"
          >
            No active ticket yet...
          </Center>
        </Skeleton>
      ) : (
        <SimpleGrid
          columns={[1, 2, 3]}
          spacing="20px"
        >
          {assignMode.get
            ? displayedTicket.map(ticket => (
              <SelectableTicketCard
                assignedTechinician={technicians.data?.find(tech => tech.id === ticket.userId)?.name ?? ""}
                isSelected={selectedIds.includes(ticket.id)}
                onClick={() => onSelectId(ticket.id)}
                title={ticket.title}
                code={ticket.code}
                key={ticket.id}
              />
            ))
            : displayedTicket.map(ticket => (
              <TicketCard
                isTechnician={isTechnician}
                subtitle={ticket.subtitle}
                title={ticket.title}
                code={ticket.code}
                key={ticket.id}
              />
            ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}