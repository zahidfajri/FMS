import { Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "@dbb-id/standarization";
import { api } from "~/utils/api";
import TicketCard from "./TicketCard";

export default function NextTicket({
  code,
}: {
  code: string;
}) {
  const nextTicket = api.ticket.getNextActiveTicketByCode.useQuery({
    code,
  });

  return (
    <>
      {nextTicket.data ? (
        <Stack spacing="5px">
          <Text
            {...fontStyle.body1bold}
            color="blue.500"
          >
            Next Suggested Ticket
          </Text>
          <TicketCard
            subtitle={nextTicket.data.subtitle}
            title={nextTicket.data.title}
            code={nextTicket.data.code}
          />
        </Stack>
      ) : <></>}
    </>
  )
}