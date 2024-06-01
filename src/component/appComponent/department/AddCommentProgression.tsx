import { Button, Flex, Input, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import imgbbUpload from "imgbb-image-uploader";
import { useState } from "react";
import InputFile from "~/component/designSystem/input/file";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function AddTicketProgress({
  ticketId,
}: {
  ticketId: number;
}) {
  const toast = useToast();

  const isCreateMode = useBooleanState();

  const isCreating = useBooleanState();
  const fetchCreate = api.comment.createCommentTechnician.useMutation();
  const query = api.useContext().comment.getCommentsByTicketId;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [errorField, setErrorField] = useState<string[]>([]);

  async function onClickCreate() {
    let tempError: string[] = [];
    if (title === "") tempError.push("title");

    if (tempError.length > 0) {
      setErrorField(tempError);
      return;
    }

    setErrorField([]);
    isCreating.set(true);
    let attachment: null | string = null;
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
    const response = await fetchCreate.mutateAsync({
      description,
      title,
      ticketId,
      attachment,
      type: "SOLVE",
    })
    isCreating.set(false);
    if (!response?.id) {
      console.log(fetchCreate.failureReason);
      return;
    }
    toast({
      title: "Changes Saved!",
      status: "success",
      position: "top",
    });
    setTitle("");
    setDescription("");
    query.invalidate();
  }

  return (
    <>
      {isCreateMode.get ? (
        <Stack
          onSubmit={e => e.preventDefault()}
          as="form"
        >
          <Text
            {...fontStyle.heading6bold}
            mb="10px"
          >
            Add Step
          </Text>
          <Input
            isInvalid={errorField.includes("title")}
            onChange={e => setTitle(e.target.value)}
            placeholder="Progress Title"
            value={title}
          />
          <Textarea
            isInvalid={errorField.includes("description")}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            value={description}
          />
          <InputFile
            buttonText="Attachment Image (optional)"
            setValue={setAttachmentFile}
            value={attachmentFile}
          />
          <Flex
            justify="end"
            w="100%"
          >
            <Button
              isLoading={isCreating.get}
              onClick={onClickCreate}
              colorScheme="blue"
              w="fit-content"
              type="submit"
            >
              Create
            </Button>
          </Flex>
        </Stack>
      ) : (
        <Button
          onClick={() => isCreateMode.set(true)}
          colorScheme="blue"
        >
          Add Step
        </Button>
      )}
    </>
  )
}