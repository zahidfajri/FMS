import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { NavbarAdmin } from "~/component/designSystem/layout/Navbar";
import { useRecoilValue } from "recoil";
import { selectedDepartmentRecoil } from "~/utils/recoil";
import ActiveTicket from "./ActiveTicket";
import ManageTechnician from "./ManageTechnician";
import DepartmentAnalytics from "./DepartmentAnalytics";

export default function DepartmentDashboard({
  id,
}: {
  id: number;
}) {

  const department = useRecoilValue(selectedDepartmentRecoil);

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
              {department?.name}
            </Text>
            <Text
              {...fontStyle.body1semibold}
              color="blue.500"
            >
              Watch progression of department ticket.
            </Text>
          </Stack>

          <DepartmentAnalytics id={id} />

          <Divider />

          {department && (
            <ManageTechnician
              departmentId={department.id}
            />
          )}

          <Divider />

          {department && (
            <ActiveTicket
              departmentId={department.id}
            />
          )}

          <Flex />
        </Stack>
      </Box>
    </>
  )
}