import { HStack, Image, Link, Stack, Tag, Text, Wrap } from "@chakra-ui/react";
import moment from "moment";
import { fontStyle } from "~/styles/fontStyle";

export default function TicketHeader({
  title,
  subtitle,
  name,
  email,
  createdAt,
  attachment,
  code,
  isSolved,
}: {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  createdAt: Date | undefined;
  attachment: string | null | undefined;
  code: string | undefined;
  isSolved: boolean | undefined;
}) {
  return (
    <>
      <Stack spacing="20px">
        {code ? (
          <Text {...fontStyle.body1bold}>
            ID #{code}
          </Text>
        ) : <></>}
        <HStack w="100%">
          <Text
            fontSize={["24px", "24px", "48px"]}
            letterSpacing="0.0025em"
            fontWeight={700}
          >
            {title}
          </Text>
          {isSolved ? (
            <Tag
              {...fontStyle.captionBold}
              colorScheme="green"
            >
              SOLVED
            </Tag>
          ) : (
            <Tag {...fontStyle.captionBold}>
              IN PROGRESS
            </Tag>
          )}
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