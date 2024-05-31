import {
  Box,
  Center,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import TicketCard from "~/component/appComponent/admin/TicketCard";
import AddTicketProgress from "~/component/appComponent/department/AddCommentProgression";
import DetailTicket from "~/component/appComponent/department/DetailTicket";
import TicketHeader from "~/component/appComponent/department/TicketHeader";
import TicketProgress from "~/component/appComponent/department/TicketProgress";
import { NavbarAdmin } from "~/component/designSystem/layout/Navbar";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { isAuthWithRole } from "~/utils/authenticationCheck";
import { getRouterQueryAsString } from "~/utils/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.query;
  return ({
    props: {
      code: getRouterQueryAsString(code),
    },
  });
};

export default function AdminReplyPage({
  code,
}: {
  code: string;
}) {
  isAuthWithRole("ADMIN", "/");

  const ticket = api.ticket.getTicketByCode.useQuery({
    code,
  });

  const nextTicket = api.ticket.getNextActiveTicketByCode.useQuery({
    code,
  });

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      minH="100svh"
      p="20px"
    >
      <Box
        px={["20px", "20px", "40px"]}
        w="100%"
      >
        <Skeleton
          isLoaded={ticket.isFetched}
          borderRadius="10px"
          w="100%"
        >
          <Stack
            p={["10px 20px", "10px 20px", "20px 40px"]}
            borderRadius="10px"
            bgColor="white"
            spacing="40px"
            w="100%"
          >
            <NavbarAdmin />

            <SimpleGrid
              columns={[1, 1, 2]}
              spacing="40px"
            >
              <Stack spacing="20px">
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

                {(ticket.data?.id && !ticket.data.isSolved) ? (
                  <AddTicketProgress ticketId={ticket.data?.id} />
                ) : <></>}

                {ticket.data?.id ? (
                  <TicketProgress ticketId={ticket.data?.id} />
                ) : <></>}

              </Stack>

              <Stack spacing="20px">
                {ticket.data?.id && (
                  <DetailTicket
                    currentDepartmentId={ticket.data.departmentId}
                    isNotFetching={ticket.isFetching === false}
                    isSolved={ticket.data?.isSolved}
                    ticketId={ticket.data?.id}
                    type={ticket.data?.type}
                  />
                )}

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


              </Stack>
            </SimpleGrid>

            <Flex />

          </Stack>
        </Skeleton>
      </Box>
    </Center>
  )
}