import { Button, Center, Link, Skeleton, Stack, Text, } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import LayoutGuest from "~/component/designSystem/layout/Layout";
import { api } from "~/utils/api";
import { getRouterQueryAsString } from "~/utils/router";
import TicketHeader from "~/component/appComponent/department/TicketHeader";
import GuestTicketProgress from "~/component/appComponent/guest/GuestTicketProgress";
import { fontStyle } from "~/styles/fontStyle";
import Iconify from "~/component/appComponent/iconify";

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
          borderRadius={["0px", "0px", "10px"]}
          isLoaded={ticket.isFetched}
          maxW="880px"
          w="100%"
        >
          <Stack
            p={["10px 20px", "10px 20px", "20px 40px"]}
            borderRadius={["0px", "0px", "10px"]}
            bgColor="white"
            spacing="20px"
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
              type={ticket.data?.type}
            />

            {ticket.data?.id && (
              <GuestTicketProgress
                isTicketSolved={ticket.data.isSolved}
                createdAt={ticket.data.createdAt}
                ticketId={ticket.data?.id}
              />
            )}

            {ticket.data?.technician?.phoneNumber ? (
              <Link
                href={`https://wa.me/${ticket.data?.technician?.phoneNumber.replace("+", "")}?text=${encodeURIComponent(
                  `Hello Technician! I want to ask something about one of my helpdesk ticket`
                )}`}
                isExternal
              >
                <Button
                  leftIcon={<Iconify icon="bxl:whatsapp" />}
                  colorScheme="whatsapp"
                  iconSpacing="5px"
                  size="xs"
                >
                  Contact Technician
                </Button>
              </Link>
            ) : <></>}

            <Text {...fontStyle.captionRegular}>
              Step and progress will be updated here
            </Text>

          </Stack>
        </Skeleton>
      </Center>
    </LayoutGuest>
  );
};
