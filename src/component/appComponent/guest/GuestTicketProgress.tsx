import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import Iconify from "../iconify";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { TicketProgressStep } from "../department/TicketProgressStep";
import moment from "moment";

export default function GuestTicketProgress({
  ticketId,
  isTicketSolved = false,
  createdAt,
}: {
  ticketId: number;
  isTicketSolved?: boolean;
  createdAt: Date,
}) {

  const progress = api.comment.getCommentsByTicketId.useQuery({
    ticketId,
  });

  const displayedData = progress.data ?? [];

  return (
    <Box>
      {displayedData.map((comment, index) => (
        <TicketProgressStep
          description={comment.description ?? undefined}
          isInProgress={index === 0 && !isTicketSolved}
          attachment={comment.attachment}
          updatedAt={comment.updatedAt}
          createdBy={comment.createBy}
          title={comment.title}
          key={comment.id}
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
            Ticket Submitted
          </Text>
          <Text {...fontStyle.captionMedium} color="gray.500">
            On {moment(createdAt).format("H:mm, on DD-MM-YYYY")}
          </Text>
        </Stack>
      </Stack>
    </Box>
  )
}