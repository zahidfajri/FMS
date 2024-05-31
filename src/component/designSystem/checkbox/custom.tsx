import { HStack, Stack, Text } from "@chakra-ui/react";
import Iconify from "~/component/appComponent/iconify";
import { fontStyle } from "~/styles/fontStyle";

export default function CustomCheckbox({
  isActive = false,
  onClick = () => { },
  value,
  title,
  description,
}: {
  isActive?: boolean;
  onClick?: (value: string) => void;
  value: string;
  title: string;
  description?: string;
}) {
  return (
    <HStack
      boxShadow={isActive
        ? "0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 2px #4299E1"
        : "0px 2px 4px rgba(0, 0, 0, 0.06), 0px 4px 6px rgba(0, 0, 0, 0.1)"
      }
      onClick={() => onClick(value)}
      borderRadius="20px"
      alignItems="start"
      userSelect="none"
      cursor="pointer"
      p="20px"
    >
      <Iconify
        icon={isActive ? "bx:checkbox-square" : "bx:checkbox"}
        color={isActive ? "blue.500" : undefined}
        boxSize="23px"
      />
      <Stack
        spacing="5px"
        w="100%"
      >
        <Text {...fontStyle.body1bold}>
          {title}
        </Text>
        {description ? (
          <Text {...fontStyle.captionRegular}>
            {description}
          </Text>
        ) : <></>}
      </Stack>
    </HStack>
  )
}