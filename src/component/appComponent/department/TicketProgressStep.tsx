import { Flex, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Iconify from "../iconify";
import { fontStyle } from "~/styles/fontStyle";
import ModalUpdateProgress from "./ModalUpdateProgress";
import moment from "moment";

export function TicketProgressStep({
  id,
  isDone = false,
  isInProgress = false,
  isSkipped = false,
  title,
  description,
  isGrantedUpdate = false,
  doneAt,
}: {
  id: number;
  isDone?: boolean;
  isInProgress?: boolean;
  isSkipped?: boolean;
  title: string;
  description?: string;
  isGrantedUpdate?: boolean;
  doneAt?: Date | null;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function getIcon() {
    if (isDone) return "bxs:check-circle";
    return "bx:circle";
  }

  function getStepColor() {
    if (isDone || isInProgress || isSkipped) return "blue.500";
    return "gray.200";
  }

  return (
    <>
      <Stack
        cursor={isGrantedUpdate ? "pointer" : undefined}
        direction="row"
        spacing="0px"
      >
        <Flex
          borderColor={getStepColor()}
          borderRightWidth="4px"
          position="relative"
          flexShrink={0}
          w="23px"
        >
          <Iconify
            color={getStepColor()}
            position="absolute"
            icon={getIcon()}
            bgColor="white"
            boxSize="40px"
            right="-22px"
            top="0px"
          />
        </Flex>
        <Flex
          flexShrink={0}
          w="23px"
        />
        <Stack
          _hover={isGrantedUpdate ? {
            bgColor: "gray.100"
          } : {}}
          onClick={() => isGrantedUpdate
            ? onOpen()
            : {}}
          borderRadius="10px"
          spacing="5px"
          minH="80px"
          p="10px"
          w="100%"
        >
          <Text
            color={(isInProgress && !isDone) ? "blue.500" : undefined}
            {...fontStyle.body1extrabold}
          >
            {title}
          </Text>
          {(isInProgress && !isDone) ? (
            <Text
              {...fontStyle.body2bold}
              borderRadius="full"
              bgColor="blue.400"
              w="fit-content"
              color="white"
              p="2px 8px"
            >
              In Progress
            </Text>
          ) : <></>}
          {description ? (
            <Text>
              {description}
            </Text>
          ) : <></>}
          {doneAt ? (
            <Text {...fontStyle.captionMedium} color="gray.500">
              ---<br />
              done at {moment(doneAt).format("H:mm DD/MM/YYYY")}
            </Text>
          ) : <></>}
        </Stack>
      </Stack>

      <ModalUpdateProgress
        currentDescription={description ?? ""}
        currentTitle={title}
        onClose={onClose}
        isOpen={isOpen}
        isDone={isDone}
        commentId={id}
      />
    </>
  )
}