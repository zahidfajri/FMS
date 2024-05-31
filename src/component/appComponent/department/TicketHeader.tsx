import { HStack, Image, Link, Stack, Text, Wrap } from "@chakra-ui/react";
import moment from "moment";
import { fontStyle } from "~/styles/fontStyle";

export default function TicketHeader({
  title,
  subtitle,
  name,
  email,
  createdAt,
  attachment,
}: {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  createdAt: Date | undefined;
  attachment: string | null | undefined;
}) {
  return (
    <>
      <Stack spacing="20px">
        <HStack w="100%" justify="space-between">
          <Text
            fontSize={["24px", "24px", "48px"]}
            letterSpacing="0.0025em"
            fontWeight={700}
          >
            {title}
          </Text>
        </HStack>
        <Text {...fontStyle.heading6medium}>
          {subtitle || "Loading..."}
        </Text>
      </Stack>
      <Wrap
        {...fontStyle.captionMedium}
        spacing="10px"
        w="100%"
      >
        <Text>
          {name}
        </Text>
        <Text>
          |
        </Text>
        <Link
          href={`mailto:${email}`}
          isExternal
        >
          {email}
        </Link>
        <Text>
          |
        </Text>
        <Text>
          {moment(createdAt).format("D MMMM YYYY, H:mm")}
        </Text>
      </Wrap>

      {attachment ? (
        <Image
          borderRadius="10px"
          src={attachment}
          w="100%"
          h="auto"
        />
      ) : <></>}
    </>
  )
}