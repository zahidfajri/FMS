import { Center } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
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

export default function DepartmentDashboardPage({
  id,
}: {
  id: string;
}) {
  isAuthWithRole("TECHNICIAN", "/");
  const session = useSession();
  const setDepartment = useSetRecoilState(selectedDepartmentRecoil);

  const department = api.department.departmentById.useQuery({
    id: Number(id),
  });

  const isGrantedAccess = session.data?.user.email && session.data?.user.email === department.data?.emailPic;

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
      {isGrantedAccess ? (
        <DepartmentDashboard />
      ) : "YOU ARE NOT THE PIC"}
    </Center>
  )
}