import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";
import { NavbarAdmin } from "~/component/designSystem/layout/Navbar";
import ActiveTicket from "./ActiveTicket";
import ManageTechnician from "./ManageTechnician";
import DepartmentAnalytics from "./DepartmentAnalytics";
import { api } from "~/utils/api";

export default function DepartmentDashboard({
  id,
  isTechnician = false,
}: {
  id: number;
  isTechnician?: boolean;
}) {

  const department = api.department.departmentById.useQuery({
    id,
  });

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
              fontSize={["16px", "24px", "48px"]}
              letterSpacing="0.0025em"
              fontWeight={700}
            >
              {department.data?.name}
            </Text>
            {department.data?.description ? (
              <Text
                {...fontStyle.body1semibold}
                color="blue.500"
              >
                {department.data?.description}
              </Text>
            ) : <></>}
          </Stack>

          <DepartmentAnalytics id={id} />

          <Divider />

          {department && (
            <ManageTechnician
              emailPIC={department.data?.emailPic}
              departmentId={id}
            />
          )}

          <Divider />

          {department && (
            <ActiveTicket
              isTechnician={isTechnician}
              departmentId={id}
            />
          )}

          <Flex />
        </Stack>
      </Box>
    </>
  )
}