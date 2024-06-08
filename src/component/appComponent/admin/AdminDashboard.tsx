import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fontStyle } from "~/styles/fontStyle";
import { NavbarAdmin } from "~/component/designSystem/layout/Navbar";
import ManageDepartment from "./ManageDepartment";
import UnassignedTicket from "./UnassignedTicket";
import AllTickets from "./AllTickets";

export default function AdminDashboard() {
  const session = useSession();

  return (
    <>
      <Box
        px={["0px", "0px", "40px"]}
        w="100%"
      >
        <Stack
          p={["10px 20px", "10px 20px", "20px 40px"]}
          borderRadius={["0px", "0px", "10px"]}
          bgColor="white"
          spacing="40px"
          w="100%"
        >
          <NavbarAdmin />

          <Stack spacing="0px">
            <Text
              fontSize={["24px", "24px", "48px"]}
              letterSpacing="0.0025em"
              fontWeight={700}
            >
              Welcome Back, {session.data?.user.name}!{" "}
            </Text>
            <Text
              {...fontStyle.body1semibold}
              color="blue.500"
            >
              Remember to assign all unassigned ticket.
            </Text>
          </Stack>
          <Divider />

          <UnassignedTicket />
          <Flex />

          <ManageDepartment />
          <Flex />

          <AllTickets />
          <Flex />

        </Stack>
      </Box>
    </>
  )
}