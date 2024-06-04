import { Center } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import DepartmentDashboard from "~/component/appComponent/department/DepartmentDashboard";
import { api } from "~/utils/api";
import { isAuthWithRole } from "~/utils/authenticationCheck"
import { selectedDepartmentRecoil } from "~/utils/recoil";
import { getRouterQueryAsString } from "~/utils/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return ({
    props: {
      id: getRouterQueryAsString(id),
    },
  });
};

export default function AdminDepartmentDashboardPage({
  id,
}: {
  id: string;
}) {
  isAuthWithRole("ADMIN", "/admin");


  const setDepartment = useSetRecoilState(selectedDepartmentRecoil);

  const department = api.department.departmentById.useQuery({
    id: Number(id),
  });

  useEffect(() => {
    if (department.data) setDepartment({
      name: department.data.name,
      id: department.data.id,
    })
  }, [department.data?.id]);

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      p={["0px", "0px", "20px"]}
      minH="100svh"
    >
      <DepartmentDashboard id={Number(id)} />
    </Center>
  )
}