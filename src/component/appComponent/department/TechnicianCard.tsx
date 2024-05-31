import {
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import Iconify from "../iconify";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { useState } from "react";
import { useBooleanState } from "~/utils/hooks";

export default function TechnicianCard({
  email,
  name,
  id,
}: {
  email: string | null;
  name: string | null;
  id: string;
}) {
  const activeTicketCount = api.ticket.getCountTicketByUserId.useQuery({
    userId: id,
  });
  const displayedCount = (activeTicketCount.data ?? 0) > 99 ? 99 : (activeTicketCount.data ?? 0);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isSaving = useBooleanState();
  const fetchUpdate = api.user.updateTechnician.useMutation().mutateAsync;
  const query = api.useContext().user.getUserByDepartmentId;
  const [tempName, setTempName] = useState(name ?? "");
  const [tempEmail, setTempEmail] = useState(email ?? "");
  const [errorField, setErrorField] = useState<string[]>([]);

  async function onSave() {
    let temp: string[] = [];

    if (tempName.length < 3) temp.push("name");
    if (tempEmail.length < 3 || !tempEmail.includes("@")) temp.push("email");

    if (temp.length > 0) {
      setErrorField(temp);
      return;
    }

    setErrorField([]);
    try {
      isSaving.set(true);
      await fetchUpdate({
        name: tempName,
        email: tempEmail,
        id,
      })
    } catch (e) {
      console.log(e)
    } finally {
      isSaving.set(false);
    }
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    onClose();
    query.invalidate();
    setTempName("");
    setTempEmail("");
  }

  return (
    <>
      <HStack
        _hover={{
          bgColor: "gray.50",
        }}
        onClick={() => onOpen()}
        borderRadius="10px"
        borderWidth="1px"
        userSelect="none"
        overflow="hidden"
        cursor="pointer"
        spacing="20px"
        p="10px"
      >
        <Flex
          position="relative"
          flexShrink={0}
          boxSize="40px"
        >
          <Iconify
            borderRadius="5px"
            borderWidth="1px"
            color="gray.500"
            icon="bxs:user"
            boxSize="40px"
          />
          {displayedCount ? (
            <Tooltip label={`Number of assgined tickets`} hasArrow>
              <Flex
                transform="translate(40%,-40%)"
                position="absolute"
                alignItems="center"
                bgColor="blue.500"
                fontWeight={700}
                justify="center"
                rounded="full"
                boxSize="20px"
                fontSize="xs"
                color="white"
                right="0px"
                top="0px"
                p="2px"
              >
                {displayedCount}
              </Flex>
            </Tooltip>
          ) : <></>}
        </Flex>
        <Stack spacing="5px" maxW="calc(100% - 60px)">
          <Text
            {...fontStyle.heading6bold}
            lineHeight="20px"
            noOfLines={1}
          >
            {name}
          </Text>
          <Text
            {...fontStyle.body2regular}
            title={email ?? "..."}
            noOfLines={1}
          >
            {email}
          </Text>
        </Stack>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={["600px", "600px", "800px"]}>
          <ModalHeader>
            Update Technician Account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="20px">
              <Stack>
                <Text fontWeight={500}>
                  Name
                </Text>
                <Input
                  isInvalid={errorField.includes("name")}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Saiful Antonio"
                  value={tempName}
                />
              </Stack>
              <Stack>
                <Text fontWeight={500}>
                  Email
                </Text>
                <Input
                  isInvalid={errorField.includes("email")}
                  onChange={e => setTempEmail(e.target.value)}
                  placeholder="saiful@email.com"
                  value={tempEmail}
                />
              </Stack>

              <Text {...fontStyle.captionRegular}>
                *Currently cannot reset password
              </Text>

              <Text {...fontStyle.captionRegular}>
                **To find who is PIC, see the email on department data.
              </Text>

            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={isSaving.get}
              colorScheme="blue"
              onClick={onSave}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}