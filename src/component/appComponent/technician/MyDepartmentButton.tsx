import { Button, Link, Stack, Tag, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { fontStyle, responsiveFontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";

export default function MyDepartmentButton() {
  const session = useSession();

  const myDepartment = api.department.myDepartment.useQuery({
    userId: session.data?.id ?? "",
  });

  const departmetLink = `/department/${myDepartment.data?.department?.id}`;

  return (
    <>
      {myDepartment.isFetched ? (
        <>
          {myDepartment.data?.isPIC ? (
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
                  Since You Are PIC of{" "}
                  <Text as="span" bgColor="gray.300" px="5px" borderRadius="5px">
                    {myDepartment.data.department?.name}
                  </Text>,
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
          ) : (
            <Tag
              {...fontStyle.body1semibold}
              w="fit-content"
            >
              {myDepartment.data?.department?.name}
            </Tag>
          )}
        </>
      ) : <></>}
    </>
  )
}