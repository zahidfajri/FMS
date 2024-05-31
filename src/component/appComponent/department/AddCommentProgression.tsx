import { Button, Flex, Input, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
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

  const [errorField, setErrorField] = useState<string[]>([]);

  async function onClickCreate() {
    let tempError: string[] = [];
    if (title === "") tempError.push("subtitle");

    if (tempError.length > 0) {
      setErrorField(tempError);
      return;
    }

    setErrorField([]);
    isCreating.set(true);
    const response = await fetchCreate.mutateAsync({
      description,
      title,
      ticketId,
      attachment: undefined,
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