import { Button, Divider, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, Textarea, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

export default function ModalCreateDepartment() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const isSaving = useBooleanState();
  const fetchCreate = api.department.createDepartment.useMutation().mutateAsync;
  const query = api.useContext().department.departments;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [emailPIC, setEmailPIC] = useState("");

  const [errorField, setErrorField] = useState<string[]>([]);

  async function onSave() {
    let temp: string[] = [];

    if (name === "") temp.push("name");
    if (description === "") temp.push("description");
    if (temp.length > 0) {
      setErrorField(temp);
      return;
    }

    setErrorField([]);
    try {
      isSaving.set(true);
      await fetchCreate({
        name,
        description,
        emailPIC: emailPIC ? emailPIC : null,
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
    setName("");
    setDescription("");
  }

  return (
    <>
      <Button
        colorScheme="blue"
        onClick={onOpen}
        size="sm"
      >
        Create
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={["600px", "600px", "800px"]}>
          <ModalHeader>
            Create Department
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
                  onChange={e => setName(e.target.value)}
                  placeholder="Tech"
                  value={name}
                />
              </Stack>
              <Stack>
                <Text fontWeight={500}>
                  Description
                </Text>
                <Textarea
                  placeholder="Department Description such as PIC or something else..."
                  isInvalid={errorField.includes("description")}
                  onChange={e => setDescription(e.target.value)}
                  value={description}
                />
              </Stack>

              <Divider />

              <Stack>
                <Text fontWeight={500}>
                  Email PIC
                </Text>
                <Input
                  isInvalid={errorField.includes("emailPIC")}
                  onChange={e => setEmailPIC(e.target.value)}
                  placeholder="smith@mail.com"
                  value={emailPIC}
                />
              </Stack>
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