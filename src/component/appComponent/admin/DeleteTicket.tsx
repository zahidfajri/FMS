import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { fontStyle } from "@dbb-id/standarization";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function DeleteTicketButton({
  ticketId,
}: {
  ticketId: number;
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isDeleting = useBooleanState();

  const fetchDelete = api.ticket.deleteTicket.useMutation();

  async function onDelete() {
    try {
      isDeleting.set(true);
      await fetchDelete.mutateAsync({ ticketId });
      toast({
        title: "Ticket Deleted Successfully!",
        status: "success",
        position: "top",
      });
      onClose();
    } catch (e) {
      console.log(e);
      toast({
        title: "Error Deleting Ticket.",
        status: "error",
        position: "top",
      });
    } finally {
      isDeleting.set(false);
    }
  }

  return (
    <>
      <Stack
        alignItems={["start", "start", "center"]}
        direction={["column", "column", "row"]}
      >
        <Stack w="100%">
          <Text {...fontStyle.body1bold}>
            Delete Ticket?
          </Text>
          <Text {...fontStyle.captionMedium}>
            Only admin can delete ticket if need.
          </Text>
        </Stack>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
        >
          Delete
        </Button>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Delete Ticket
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text {...fontStyle.body1medium}>
              Are you sure want to delete this ticket? This action is irreversible.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack
              justify="space-between"
              w="100%"
            >
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                isLoading={isDeleting.get}
                onClick={onDelete}
                colorScheme="red"
              >
                Delete
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}