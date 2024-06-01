import { Box, Divider, Flex, Stack } from "@chakra-ui/react";
import { NavbarAdmin } from "~/component/designSystem/layout/Navbar";
import MyDepartmentButton from "./MyDepartmentButton";
import TechnicianHeader from "./TechnicianHeader";
import TechnicianTicket from "./TechnicianTicket";

export default function TechnicianDashboard() {
  return (
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

        <Stack spacing="20px">
          <TechnicianHeader />
          <MyDepartmentButton />
          <Divider />
        </Stack>

        {/* YOUR TICKET */}
        <TechnicianTicket />

        <Flex />

      </Stack>
    </Box>
  )
}