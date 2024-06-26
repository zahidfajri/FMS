import { Flex, Link, Stack, Text, useDisclosure } from "@chakra-ui/react";
import Iconify from "../iconify";
import { fontStyle } from "~/styles/fontStyle";
import ModalUpdateProgress from "./ModalUpdateProgress";
import moment from "moment";
import cleanImgbbUrl from "~/utils/imgbb";

export function TicketProgressStep({
  id,
  isInProgress = false,
  title,
  description,
  isGrantedUpdate = false,
  updatedAt,
  createdBy,
  attachment,
}: {
  id: number;
  isInProgress?: boolean;
  title: string;
  description?: string;
  isGrantedUpdate?: boolean;
  updatedAt?: Date | null;
  createdBy?: string | null;
  attachment?: string | null;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function getIcon() {
    if (isInProgress) return "bx:circle";
    return "bxs:check-circle";
  }

  return (
    <>
      <Stack
        cursor={isGrantedUpdate ? "pointer" : undefined}
        direction="row"
        spacing="0px"
      >
        <Flex
          borderColor="blue.500"
          borderRightWidth="4px"
          position="relative"
          flexShrink={0}
          w="23px"
        >
          <Iconify
            position="absolute"
            color="blue.500"
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
            color={(isInProgress) ? "blue.500" : undefined}
            {...fontStyle.body1extrabold}
          >
            {title}
          </Text>
          {description ? (
            <Text>
              {description}
            </Text>
          ) : <></>}
          {attachment ? (
            <Link
              onClick={e => e.stopPropagation()}
              href={attachment}
              fontWeight={700}
              isExternal
            >
              Attached: {cleanImgbbUrl(attachment)}
            </Link>
          ) : <></>}
          {updatedAt ? (
            <Text {...fontStyle.captionMedium} color="gray.500">
              {createdBy ?
                `By ${createdBy}`
                : ""
              }
              {updatedAt
                ? `${!createdBy ? "Updated" : ""} at ${moment(updatedAt).format("H:mm, on DD-MM-YYYY")}`
                : ""
              }
            </Text>
          ) : <></>}
        </Stack>
      </Stack>

      <ModalUpdateProgress
        currentDescription={description ?? ""}
        currentAttachment={attachment ?? null}
        currentTitle={title}
        onClose={onClose}
        isOpen={isOpen}
        commentId={id}
      />
    </>
  )
}