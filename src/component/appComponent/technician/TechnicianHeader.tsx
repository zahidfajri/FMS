import { Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fontStyle } from "~/styles/fontStyle";

export default function TechnicianHeader() {
  const session = useSession();

  return (
    <Stack spacing="0px">
      <Text
        fontSize={["24px", "24px", "48px"]}
        letterSpacing="0.0025em"
        fontWeight={700}
      >
        Welcome {session.data?.user.name}!{" "}
      </Text>
      <Text
        {...fontStyle.body1semibold}
        color="blue.500"
      >
        Remember to give progression all of your tickets.
      </Text>
    </Stack>
  )
}