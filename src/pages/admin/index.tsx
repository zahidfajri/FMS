import { Center, } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import SignInComponent from "~/component/appComponent/SignInComponent";

export default function AdminLoginPage() {
  const session = useSession();
  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      minH="100svh"
      p="20px"
    >
      <SignInComponent
        redirectSuccess="/admin/dashboard"
        isLoaded={session.status !== "loading"}
      />
    </Center>
  )
}