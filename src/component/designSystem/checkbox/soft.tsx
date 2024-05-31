import { HStack, Stack, Text, Tooltip } from "@chakra-ui/react";
import { fontStyle } from "~/styles/fontStyle";

export default function SoftCheckbox({
  isActive = false,
  onClick = () => { },
  title,
  description,
  tooltip,
  isBlinking,
}: {
  isActive?: boolean;
  onClick?: () => void;
  title: string;
  description?: string;
  tooltip?: string;
  isBlinking?: boolean;
}) {
  return (
    <Tooltip
      label={tooltip}
      hasArrow
    >
      <HStack
        className={isBlinking ? "flareAnimation" : undefined}
        borderColor={isActive ? "blue.400" : "gray.200"}
        bgColor={isActive ? "blue.50" : undefined}
        color={isActive ? "blue.500" : undefined}
        onClick={() => onClick()}
        borderRadius="10px"
        position="relative"
        alignItems="start"
        borderWidth="1px"
        userSelect="none"
        overflow="hidden"
        cursor="pointer"
        p="10px"
        w="100%"
      >
        <Stack
          alignItems="center"
          spacing="5px"
          w="100%"
        >
          <Text
           {...fontStyle.body1bold}
           wordBreak="break-word"
          >
            {title}
          </Text>
          {description ? (
            <Text {...fontStyle.captionRegular}>
              {description}
            </Text>
          ) : <></>}
        </Stack>
      </HStack>
    </Tooltip>
  )
}