import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import CustomCheckbox from "~/component/designSystem/checkbox/custom";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { generateRandomPassword } from "~/utils/generateRandomPassword";
import { useBooleanState } from "~/utils/hooks";

export default function ModalCreateTechnician({
  departmentId,
}: {
  departmentId: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const isSaving = useBooleanState();
  const fetchCreate = api.user.createTechnician.useMutation().mutateAsync;
  const query = api.useContext().user.getUserByDepartmentId;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(generateRandomPassword());
  const [isPIC, setIsPIC] = useState("no");

  const [errorField, setErrorField] = useState<string[]>([]);

  async function onSave() {
    let temp: string[] = [];

    if (name.length < 3) temp.push("name");
    if (email.length < 3 || !email.includes("@")) temp.push("email");
    if (phoneNumber.length < 3) temp.push("phoneNumber");
    if (password.length < 8) {
      toast({
        title: "Input Invalid!",
        description: "Password must contain at least 8 characters",
        status: "info",
        position: "top",
      });
      temp.push("password");
    }

    if (temp.length > 0) {
      setErrorField(temp);
      return;
    }

    setErrorField([]);
    try {
      isSaving.set(true);
      await fetchCreate({
        name,
        email,
        password,
        departmentId,
        isPIC: isPIC === "yes",
        phoneNumber: phoneNumber ?? null,
      })
    } catch (e) {
      console.error(e)
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
    setEmail("");
    setPassword(generateRandomPassword());
    setIsPIC("no");
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
            Create Technician Account
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
                  placeholder="Saiful Antonio"
                  value={name}
                />
              </Stack>
              <Stack>
                <Text fontWeight={500}>
                  Email
                </Text>
                <Input
                  isInvalid={errorField.includes("email")}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="saiful@email.com"
                  value={email}
                />
              </Stack>
              <Stack>
                <Text fontWeight={500}>
                  Phone Number (optional)
                </Text>
                <Input
                  isInvalid={errorField.includes("phoneNumber")}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="+6081234567890"
                  value={phoneNumber}
                  type="tel"
                />
              </Stack>
              <Stack>
                <HStack>
                  <Text fontWeight={500}>
                    Password
                  </Text>
                  <Tooltip
                    label="By default, we have generated password for you. Password will send to technician's email."
                    hasArrow
                  >
                    <Text
                      {...fontStyle.captionBold}
                      textTransform="uppercase"
                      borderRadius="4px"
                      bgColor="blue.100"
                      color="blue.500"
                      p="2px 6px"
                    >
                      generated
                    </Text>
                  </Tooltip>
                </HStack>
                <Input
                  isInvalid={errorField.includes("password")}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="password"
                  value={password}
                />
              </Stack>
              <SimpleGrid
                spacing="10px"
                columns={2}
              >
                <CustomCheckbox
                  onClick={(e) => setIsPIC(e)}
                  isActive={isPIC === "no"}
                  title="Normal Technician"
                  value="no"
                />
                <CustomCheckbox
                  onClick={(e) => setIsPIC(e)}
                  isActive={isPIC === "yes"}
                  title="Head Technician"
                  value="yes"
                />
              </SimpleGrid>

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