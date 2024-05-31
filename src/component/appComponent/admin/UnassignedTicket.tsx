import { Center, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import TicketCard from "./TicketCard";

export default function UnassignedTicket() {

  const unassignedTicket = api.ticket.getUnassignedTicket.useQuery();
  const displayedTicket = unassignedTicket.data ?? [];

  return (
    <Stack>
      <Text {...fontStyle.heading6bold}>
        Unassigned Ticket {!displayedTicket.length ? "" : `(${displayedTicket.length})`}
      </Text>
      {!displayedTicket.length ? (
        <Skeleton
          isLoaded={unassignedTicket.isFetched}
          borderRadius="10px"
          w="100%"
        >
          <Center
            w="100%"
            p="40px"
          >
            No unassigned ticket yet. Congrats!
          </Center>
        </Skeleton>
      ) : (
        <SimpleGrid
          columns={[1, 2, 3]}
          spacing="20px"
        >
          {displayedTicket.map(ticket => (
            <TicketCard
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