import { Center, } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import AdminDashboard from "~/component/appComponent/admin/AdminDashboard";
import DepartmentDashboard from "~/component/appComponent/department/DepartmentDashboard";
import { isAuthWithRole } from "~/utils/authenticationCheck";
import { LS_SELECTED_DEPARTMENT } from "~/utils/constant";
import { selectedDepartmentRecoil } from "~/utils/recoil";

export default function AdminDashboardPage() {
  isAuthWithRole("ADMIN", "/admin");

  const [selectedDepartment, setSelectedDepartment] = useRecoilState(selectedDepartmentRecoil);

  useEffect(() => {
    const localDepartment = localStorage.getItem(LS_SELECTED_DEPARTMENT);
    if (!localDepartment) return;
    const parsedDepartment = JSON.parse(localDepartment);
    setSelectedDepartment(parsedDepartment);
  }, []);

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      minH="100svh"
      p="20px"
    >
      {selectedDepartment ? (
        <DepartmentDashboard />
      ) : (
        <AdminDashboard />
      )}
    </Center>
  )
}