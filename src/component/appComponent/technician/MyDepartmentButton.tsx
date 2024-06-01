import { Button, Link, Stack, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fontStyle, responsiveFontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";

export default function MyDepartmentButton() {
  const session = useSession();

  const myDepartment = api.department.myDepartment.useQuery({
    userId: session.data?.id as string,
  });

  const departmetLink = `/department/${myDepartment.data?.id}`;

  return (
    <>
      {myDepartment.data?.id ? (
        <Stack
          alignItems={["start", "start", "center"]}
          direction={["column", "column", "row"]}
          justify="space-between"
          borderRadius="10px"
          bgColor="gray.100"
          p="20px"
          w="100%"
        >
          <Stack>
            <Text {...responsiveFontStyle(fontStyle.heading6bold, fontStyle.heading5bold)}>
              Since You Are PIC,
            </Text>
            <Text>
              you can assign ticket to another technician on{" "}
              <Link
                href={departmetLink}
                fontWeight={700}
                color="blue.600"
                isExternal
              >
                department dashboard.
              </Link>
            </Text>
          </Stack>
          <Link href={departmetLink} isExternal>
            <Button colorScheme="blue">
              Go To Department
            </Button>
          </Link>
        </Stack>
      ) : <></>
      }
    </>
  )
}