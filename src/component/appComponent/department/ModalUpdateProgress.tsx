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
import imgbbUpload from "imgbb-image-uploader";
import { useState } from "react";
import InputFile from "~/component/designSystem/input/file";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function ModalUpdateProgress({
  isOpen,
  onClose,
  currentTitle,
  currentDescription,
  currentAttachment,
  commentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentDescription: string;
  currentAttachment: string | null;
  commentId: number;
}) {
  const toast = useToast();

  const fetchUpdate = api.comment.updateCommentTechnician.useMutation();
  const query = api.useContext().comment.getCommentsByTicketId;

  const isSaving = useBooleanState();
  const [title, setTitle] = useState(currentTitle);
  const [description, setDescription] = useState(currentDescription);
  const [attachmentUrl, setAttachmentUrl] = useState(currentAttachment);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  async function onClickSave() {
    isSaving.set(true);

    let attachment: null | string = attachmentUrl;
    if (attachmentFile) {
      window.onbeforeunload = () => 'You have unsaved changes!';
      const name = `progress-attachment-${new Date().getTime()}`;
      let response: any;
      try {
        response = await imgbbUpload({
          key: process.env.NEXT_PUBLIC_IMGBB_CLIENT_API_KEY,
          image: attachmentFile,
          name,
        });
        attachment = response?.data?.image?.url ?? null;
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Something went wrong while uploading the file.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        console.error("Failed to upload image to ImgBB:", error);
      } finally {
        window.onbeforeunload = null;
      }
    }

    const response = await fetchUpdate.mutateAsync({
      commentId,
      title,
      description,
      attachment,
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
            {attachmentUrl ? (
              <Button
                onClick={() => setAttachmentUrl(null)}
                w="fit-content"
              >
                Remove Attachment
              </Button>
            ) : (
              <InputFile
                buttonText="Attachment Image (optional)"
                setValue={setAttachmentFile}
                value={attachmentFile}
              />
            )}
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