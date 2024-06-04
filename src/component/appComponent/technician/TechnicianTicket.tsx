import { Center, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import TechnicianTicketCard from "./TechnicianTicketCard";

export default function TechnicianTicket() {
  const session = useSession();

  const activeTicketsByTechnicianId = api.ticket.getActiveTicketsByTechnicianId.useQuery({
    userId: session.data?.id ?? "",
  });
  const displayedTicket = activeTicketsByTechnicianId.data ?? [];


  return (
    <Stack>
      <Text {...fontStyle.heading6bold}>
        Your Active Ticket {!displayedTicket.length ? "" : `(${displayedTicket.length})`}
      </Text>
      {!displayedTicket.length ? (
        <Skeleton
          isLoaded={activeTicketsByTechnicianId.isFetched}
          borderRadius="10px"
          w="100%"
        >
          <Center
            w="100%"
            p="40px"
          >
            No active ticket yet. Congrats!
          </Center>
        </Skeleton>
      ) : (
        <SimpleGrid
          columns={[1, 2, 3]}
          spacing="20px"
        >
          {displayedTicket.map(ticket => (
            <TechnicianTicketCard
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