import { Center, Skeleton, Stack, Text, } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import LayoutGuest from "~/component/designSystem/layout/Layout";
import { api } from "~/utils/api";
import { getRouterQueryAsString } from "~/utils/router";
import TicketHeader from "~/component/appComponent/department/TicketHeader";
import GuestTicketProgress from "~/component/appComponent/guest/GuestTicketProgress";
import { fontStyle } from "~/styles/fontStyle";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.query;
  return ({
    props: {
      code: getRouterQueryAsString(code),
    },
  });
};

export default function TrackIdPage({
  code,
}: {
  code: string;
}) {
  const ticket = api.ticket.getTicketByCode.useQuery({
    code,
  });

  return (
    <LayoutGuest>
      <Center
        bgGradient="linear(to-r, blue.200, cyan.100)"
        py={["0px", "0px", "20px"]}
        minH="calc(100svh - 80px)"
      >
        <Skeleton
          isLoaded={ticket.isFetched}
          borderRadius="10px"
          maxW="880px"
          w="100%"
        >
          <Stack
            borderRadius="10px"
            bgColor="white"
            spacing="20px"
            p="40px"
            w="100%"
          >
            <TicketHeader
              subtitle={ticket.data?.subtitle ?? "loading"}
              title={ticket.data?.title ?? "loading"}
              email={ticket.data?.email ?? "loading"}
              name={ticket.data?.name ?? "loading"}
              attachment={ticket.data?.attachment}
              createdAt={ticket.data?.createdAt}
              isSolved={ticket.data?.isSolved}
              code={ticket.data?.code}
            />

            {ticket.data?.id && (
              <GuestTicketProgress
                ticketId={ticket.data?.id}
              />
            )}

            <Text {...fontStyle.captionRegular}>
              Step and progress will be updated here
            </Text>

          </Stack>
        </Skeleton>
      </Center>
    </LayoutGuest>
  );
};
