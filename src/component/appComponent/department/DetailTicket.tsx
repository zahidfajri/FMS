import { Divider, Stack, Text, } from "@chakra-ui/react";
import { TicketType } from "@prisma/client";
import { fontStyle } from "~/styles/fontStyle";
import DetailTicketType from "./DetailTicketType";
import DetailTicketDepartment from "./DetailTicketDepartment";
import DetailTicketSolve from "./DetailTicketSolve";

export default function DetailTicket({
  ticketId,
  currentDepartmentId,
  type = null,
  isNotFetching = false,
  isSolved = false,
}: {
  ticketId: number;
  currentDepartmentId: number | null;
  type?: TicketType | null;
  isNotFetching?: boolean;
  isSolved?: boolean;
}) {

  return (
    <Stack
      borderRadius="10px"
      bgColor="gray.50"
      spacing="20px"
      p="20px"
    >
      <Text {...fontStyle.heading6bold}>
        Detail
      </Text>

      <Divider />

      <DetailTicketType
        isNotFetching={isNotFetching}
        ticketId={ticketId}
        type={type}
      />

      <Divider />

      <DetailTicketDepartment
        currentDepartmentId={currentDepartmentId}
        ticketId={ticketId}
      />

      <Divider />

      <DetailTicketSolve
        isNotFetching={isNotFetching}
        ticketId={ticketId}
        isSolved={isSolved}
      />
    </Stack>
  )
}