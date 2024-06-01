import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function ModalUpdateProgress({
  isOpen,
  onClose,
  currentTitle,
  currentDescription,
  commentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentDescription: string;
  commentId: number;
}) {
  const toast = useToast();

  const fetchUpdate = api.comment.updateCommentTechnician.useMutation();
  const query = api.useContext().comment.getCommentsByTicketId;

  const isSaving = useBooleanState();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);

  async function onClickSave() {
    isSaving.set(true);
    const response = await fetchUpdate.mutateAsync({
      commentId,
      title,
      description,
    });
    isSaving.set(false);
    if (!response?.id) return;
    query.invalidate();
    onClose();
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Edit Step
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing="20px">
            <Input
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              value={title}
            />
            <Textarea
              onChange={e => setDescription(e.target.value)}
              placeholder="Description of step (optional)"
              value={description}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isSaving.get}
            onClick={onClickSave}
            colorScheme="blue"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}