import { Center, } from "@chakra-ui/react";
import AdminDashboard from "~/component/appComponent/admin/AdminDashboard";
import { isAuthWithRole } from "~/utils/authenticationCheck";

export default function AdminDashboardPage() {
  isAuthWithRole("ADMIN", "/admin");

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      p={["0px", "0px", "20px"]}
      minH="100svh"
    >
      <AdminDashboard />
    </Center>
  )
}