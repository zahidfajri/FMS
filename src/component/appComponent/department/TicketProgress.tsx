import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { TicketProgressStep } from "./TicketProgressStep";
import Iconify from "../iconify";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";

export default function TicketProgress({
  ticketId,
}: {
  ticketId: number;
}) {

  const progress = api.comment.getCommentsByTicketId.useQuery({
    ticketId,
  });

  const displayedData = progress.data ?? [];

  const inProgressIndex = displayedData.findIndex((comment, index) =>
    !comment.isDone
    && (index === displayedData.length - 1 || displayedData[index + 1]?.isDone)
    && displayedData[index - 1]?.isDone === false
  );

  return (
    <Box>
      {displayedData.map((comment, index) => (
        <TicketProgressStep
          isInProgress={index === inProgressIndex || (inProgressIndex === -1 && index === displayedData.length - 1)}
          description={comment.description ?? undefined}
          isSkipped={index > inProgressIndex}
          isDone={comment.isDone}
          doneAt={comment.doneAt}
          title={comment.title}
          key={comment.id}
          isGrantedUpdate
          id={comment.id}
        />
      ))}
      <Stack direction="row" spacing="0px">
        <Flex
          borderRightWidth="4px"
          borderColor="white"
          position="relative"
          flexShrink={0}
          h="100px"
          w="23px"
        >
          <Iconify
            icon="bxs:check-circle"
            position="absolute"
            color="blue.500"
            bgColor="white"
            boxSize="40px"
            right="-22px"
            top="0px"
          />
        </Flex>
        <Flex
          flexShrink={0}
          w="23px"
        />
        <Stack
          spacing="5px"
          p="10px"
          w="100%"
        >
          <Text {...fontStyle.body1extrabold}>
            Ticket Created
          </Text>
        </Stack>
      </Stack>
    </Box>

  )
}