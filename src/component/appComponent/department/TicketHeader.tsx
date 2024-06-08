import { Image, Link, Stack, Tag, Text, Wrap, WrapItem } from "@chakra-ui/react";
import moment from "moment";
import { fontStyle, responsiveFontStyle } from "~/styles/fontStyle";

export default function TicketHeader({
  title,
  subtitle,
  name,
  email,
  createdAt,
  attachment,
  code,
  isSolved,
  type,
}: {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  createdAt: Date | undefined;
  attachment: string | null | undefined;
  code: string | undefined;
  isSolved: boolean | undefined;
  type: string | undefined | null;
}) {

  function colorBasedOnType() {
    if (type === "INQUIRY") return "blue";
    if (type === "COMPLAINT") return "red";
    if (type === "SUGGESTION") return "yellow";
    if (type === "COMPLIMENT") return "green";
  }
  const colorSchemeTicket = colorBasedOnType();

  return (
    <>
      <Stack spacing="20px">
        {code ? (
          <Text {...fontStyle.body1bold}>
            ID #{code}
          </Text>
        ) : <></>}
        <Wrap>
          <WrapItem>
            {isSolved ? (
              <Tag
                {...fontStyle.captionBold}
                colorScheme="green"
                w="fit-content"
              >
                SOLVED
              </Tag>
            ) : (
              <Tag
                {...fontStyle.captionBold}
                w="fit-content"
              >
                IN PROGRESS
              </Tag>
            )}
          </WrapItem>
          {type ? (
            <WrapItem>
              <Tag
                colorScheme={colorSchemeTicket}
                {...fontStyle.captionBold}
                w="fit-content"
              >
                {type}
              </Tag>
            </WrapItem>
          ) : <></>}
        </Wrap>
        <Text
          fontSize={["24px", "24px", "48px"]}
          letterSpacing="0.0025em"
          fontWeight={700}
        >
          {title}
        </Text>
        <Text
          {...responsiveFontStyle(fontStyle.body1medium, fontStyle.heading6medium)}
        >
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