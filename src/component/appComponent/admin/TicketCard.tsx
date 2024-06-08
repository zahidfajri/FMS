import { HStack, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { fontStyle } from "~/styles/fontStyle";

export default function TicketCard({
  code,
  title,
  subtitle,
  isTechnician = false,
}: {
  code: string;
  title: string;
  subtitle: string;
  isTechnician?: boolean;
}) {
  return (
    <Link
      href={isTechnician ? `/technician/ticket/${code}` : `/admin/ticket/${code}`}
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

export function SelectableTicketCard({
  code,
  title,
  assignedTechinician,
  isSelected,
  onClick,
}: {
  code: string;
  title: string;
  assignedTechinician: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <HStack
      _hover={{
        bgColor: "gray.50",
      }}
      boxShadow={isSelected ? "inset 0px 0px 0px 3px #4299E1" : "inset 0px 0px 0px 1px #E2E8F0"}
      onClick={() => onClick()}
      justify="space-between"
      alignItems="center"
      borderRadius="8px"
      userSelect="none"
      overflow="hidden"
      cursor="pointer"
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
          {assignedTechinician
            ? `Assigned to ${assignedTechinician}`
            : "Unassigned"
          }
        </Text>
      </Stack>
    </HStack>
  )
}
