import { Button, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";

export default function DetailTicketSolve({
  ticketId,
  isSolved = false,
  isNotFetching = false,
}: {
  ticketId: number;
  isSolved?: boolean;
  isNotFetching?: boolean;
}) {
  const toast = useToast();

  const fetchUpdateStatus = api.ticket.updateTicketStatus.useMutation();
  const query = api.useContext().ticket.getTicketByCode;

  async function onClickMark() {
    const response = await fetchUpdateStatus.mutateAsync({
      ticketId,
      isSolved: true,
    });
    if (!response?.id) return;
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    query.invalidate();
  }

  return (
    <HStack>
      <Stack w="100%">
        <Text {...fontStyle.body1bold}>
          Solved Status
        </Text>
        <Text {...fontStyle.captionMedium}>
          This action will directly notify the reporter and irreversible.
        </Text>
      </Stack>
      <Button
        isLoading={!isNotFetching}
        isDisabled={isSolved}
        onClick={onClickMark}
        colorScheme="blue"
        flexShrink={0}
        w="147px"
      >
        {isSolved ? "Solved ✓" : "Mark as Solved"}
      </Button>
    </HStack>
  )
}