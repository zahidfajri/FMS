import { Divider, Stack, Text, } from "@chakra-ui/react";
import { TicketType } from "@prisma/client";
import { fontStyle } from "~/styles/fontStyle";
import DetailTicketType from "./DetailTicketType";
import DetailTicketDepartment from "./DetailTicketDepartment";
import DetailTicketSolve from "./DetailTicketSolve";
import { useSession } from "next-auth/react";
import DeleteTicketButton from "../admin/DeleteTicket";

export default function DetailTicket({
  ticketId,
  currentDepartmentId,
  type = null,
  isNotFetching = false,
  isSolved = false,
  isTechnician = false,
}: {
  ticketId: number;
  currentDepartmentId: number | null;
  type?: TicketType | null;
  isNotFetching?: boolean;
  isSolved?: boolean;
  isTechnician?: boolean;
}) {

  const session = useSession();

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

      {!isTechnician ? (
        <>
          <Divider />
          <DetailTicketDepartment
            currentDepartmentId={currentDepartmentId}
            ticketId={ticketId}
          />
        </>
      ) : <></>}

      <Divider />

      <DetailTicketSolve
        isNotFetching={isNotFetching}
        ticketId={ticketId}
        isSolved={isSolved}
      />

      {session.data?.user.role === "ADMIN" ? (
        <>
          <Divider />
          <DeleteTicketButton ticketId={ticketId} />
        </>
      ) : <></>}

    </Stack>
  )
}