import { HStack, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { fontStyle } from "~/styles/fontStyle";

export default function TechnicianTicketCard({
  code,
  title,
  subtitle,
}: {
  code: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={`/technician/ticket/${code}`}
      passHref
    >
      <HStack
        _hover={{
          bgColor: "gray.50",
          boxShadow: "lg",
        }}
        justify="space-between"
        alignItems="center"
        borderRadius="8px"
        userSelect="none"
        overflow="hidden"
        cursor="pointer"
        boxShadow="md"
        w="100%"
        p="16px"
      >
        <Stack spacing="4px" w="100%">
          <Text
            {...fontStyle.captionBold}
            color="gray.500"
            noOfLines={1}
          >
            #{code}
          </Text>
          <Text
            {...fontStyle.heading5bold}
            noOfLines={1}
          >
            {title}
          </Text>
          <Text
            {...fontStyle.body2regular}
            noOfLines={2}
            h="42px"
          >
            {subtitle}
          </Text>
        </Stack>
      </HStack>
    </Link>
  )
}
