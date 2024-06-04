import { Center } from "@chakra-ui/react";
import TechnicianDashboard from "~/component/appComponent/technician/TechnicianDashboard";
import { isAuthWithRole } from "~/utils/authenticationCheck";

export default function TechDashboardPage() {
  isAuthWithRole("TECHNICIAN", "/technician");

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      p={["0px", "0px", "20px"]}
      minH="100svh"
    >
      <TechnicianDashboard />
    </Center>
  )
}