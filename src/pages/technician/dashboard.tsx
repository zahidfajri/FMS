import { Center, Link, } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { isAuthWithRole } from "~/utils/authenticationCheck";

export default function TechDashboardPage() {
  isAuthWithRole("TECHNICIAN", "/technician");
  const session = useSession();

  const myDepartment = api.department.myDepartment.useQuery({
    userId: session.data?.id as string,
  });

  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      minH="100svh"
      p="20px"
    >
      {myDepartment.data?.id &&
        <Link href={`/department/${myDepartment.data?.id}`} isExternal>
          Link to department
        </Link>
      }
    </Center>
  )
}