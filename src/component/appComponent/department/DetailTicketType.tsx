import { SimpleGrid, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";
import { TicketType } from "@prisma/client";
import SoftCheckbox from "~/component/designSystem/checkbox/soft";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";

export default function DetailTicketType({
  ticketId,
  type,
  isNotFetching,
}: {
  ticketId: number;
  type: TicketType | null;
  isNotFetching?: boolean;
}) {
  const toast = useToast();

  const fetchUpdateStatus = api.ticket.updateTicketType.useMutation();
  const query = api.useContext().ticket.getTicketByCode;

  async function onClick(value: TicketType) {
    const response = await fetchUpdateStatus.mutateAsync({
      ticketId,
      type: value,
    });
    if (!response.id) return;
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    query.invalidate();
  }
  return (
    <Stack>
      <Text {...fontStyle.body1bold}>
        Ticket Type
      </Text>
      <Text {...fontStyle.captionMedium}>
        Make tickets easy to categorize.
      </Text>
      <SimpleGrid
        spacing="5px"
        columns={4}
      >
        {(["INQUIRY", "COMPLAINT", "SUGGESTION", "COMPLIMENT"] as const).map(a => (
          <Skeleton
            isLoaded={isNotFetching}
            borderRadius="10px"
            key={a}
          >
            <SoftCheckbox
              tooltip="Click to change type"
              isBlinking={type === null}
              onClick={() => onClick(a)}
              isActive={type === a}
              title={a}
            />
          </Skeleton>
        ))}
      </SimpleGrid>
    </Stack>
  )
}