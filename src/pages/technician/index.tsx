import { Center, } from "@chakra-ui/react";
import SignInComponent from "~/component/appComponent/SignInComponent";

export default function LoginPage() {
  return (
    <Center
      bgGradient="linear(to-l, blue.600, blue.300)"
      minH="100svh"
      p="20px"
    >
      <SignInComponent
        redirectSuccess="/technician/dashboard"
        title="Technician Login"
        isLoaded
      />
    </Center>
  )
}