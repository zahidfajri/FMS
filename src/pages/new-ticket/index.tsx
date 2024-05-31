import {
  Button,
  Center,
  HStack,
  Input,
  Link,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { TicketType } from "@prisma/client";
import { useEffect, useState } from "react";
import Iconify from "~/component/appComponent/iconify";
import CustomCheckbox from "~/component/designSystem/checkbox/custom";
import LayoutGuest from "~/component/designSystem/layout/Layout";
import UploadImage from "~/component/designSystem/uploadImage";
import { fontStyle } from "~/styles/fontStyle";
import { api } from "~/utils/api";
import { useBooleanState } from "~/utils/hooks";

const typeOptions = [
  {
    title: "Inquiry / Question",
    description: "Help you overcome your confusion",
    value: "INQUIRY",
  },
  {
    title: "Complaint",
    description: "Express your concerns or dissatisfaction",
    value: "COMPLAINT",
  },
  {
    title: "Suggestion",
    description: "Provide your ideas or recommendations",
    value: "SUGGESTION",
  },
  {
    title: "Compliment",
    description: "Share your praise or appreciation",
    value: "COMPLIMENT",
  },
] as const;


export default function NewTicketPage() {
  const toast = useToast();

  const departments = api.department.departments.useQuery();

  const isSubmitting = useBooleanState();
  const submitTicket = api.ticket.createTicket.useMutation().mutateAsync;

  const [generatedCode, setGeneratedCode] = useState("");
  const [errorField, setErrorField] = useState<string[]>([]);

  // DESCRIBE ISSUE
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [attachment, setAttachment] = useState("");

  // IDENTITY REPORTER
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (window) {
      const localName = localStorage.getItem("lastreporter-name");
      if (localName) setName(localName);
      const localEmail = localStorage.getItem("lastreporter-email");
      if (localEmail) setEmail(localEmail);
    }
  }, []);

  // DETAIL ISSUE
  const [departmentId, setDepartmentId] = useState("");
  const [type, setType] = useState<TicketType | null>(null);

  function onClickType(value: TicketType) {
    if (value === type) {
      setType(null);
      return;
    }
    setType(value);
  }

  async function onClickKirim() {
    let tempError: string[] = [];
    if (title === "") tempError.push("subtitle");
    if (subtitle === "") tempError.push("subtitle");
    if (name === "" || name.length < 3) tempError.push("name");
    if (email === "") tempError.push("email");

    if (tempError.length > 0) {
      setErrorField(tempError);
      return;
    }

    setErrorField([]);
    localStorage.setItem("lastreporter-name", name);
    localStorage.setItem("lastreporter-email", email);
    isSubmitting.set(true);
    const response = await submitTicket({
      title,
      subtitle,
      email,
      name,
      departmentId: departmentId ? Number(departmentId) : undefined,
      type,
      attachment,
    });
    if (!response) {
      toast({
        title: "Something Went Wrong!",
        description: "Please try again later",
        status: "error",
        position: "top",
      });
      return;
    }
    isSubmitting.set(false);
    toast({
      title: "Success Submit Ticket!",
      description: "We will email you if the email exist",
      status: "success",
      position: "top",
    });
    setTitle("");
    setSubtitle("");
    setDepartmentId("");
    setType(null);

    setGeneratedCode(response.code);
  }

  return (
    <LayoutGuest>
      <Center
        bgGradient="linear(to-r, blue.200, cyan.100)"
        minH="calc(100svh - 160px)"
        py={["0px", "0px", "20px"]}
      >
        {generatedCode ? (
          <Stack
            borderRadius="10px"
            alignItems="center"
            textAlign="center"
            bgColor="white"
            spacing="20px"
            maxW="600px"
            p="40px"
            w="100%"
          >
            <Text {...fontStyle.heading4bold}>
              Success Submit Ticket
            </Text>

            <Stack alignItems="center">
              <Text>
                This is your ticket code,
              </Text>
              <Text
                {...fontStyle.heading5bold}
                borderRadius="8px"
                bgColor="blue.100"
                userSelect="all"
                p="5px 20px"
              >
                {generatedCode}
              </Text>
            </Stack>

            <Text>
              Alternatively, you can track your ticket using{" "}
              <Link
                href={`/track/${generatedCode}`}
                fontWeight={700}
                color="blue.500"
              >
                this link{" "}
              </Link>
              that has been sent to your email.
            </Text>
          </Stack>
        ) : (
          <Stack
            borderRadius="10px"
            bgColor="white"
            spacing="40px"
            maxW="880px"
            p="40px"
            w="100%"
          >
            <HStack>
              <Iconify
                icon="bxs:circle"
                color="blue.400"
              />
              <Iconify
                icon="bxs:circle"
                color="cyan.400"
              />
              <Iconify
                icon="bxs:circle"
                color="gray.400"
              />
            </HStack>

            <Stack spacing="20px">
              <Stack>
                <Text {...fontStyle.heading6bold}>
                  Describe Your Issue
                </Text>
                <Text>
                  A clearer description makes it easier to process.
                </Text>
              </Stack>

              <Input
                isInvalid={errorField.includes("title")}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                value={title}
              />
              <Textarea
                placeholder="Describe your needs or reports"
                isInvalid={errorField.includes("subtitle")}
                onChange={e => setSubtitle(e.target.value)}
                value={subtitle}
              />
            </Stack>

            <Stack spacing="20px">
              <Stack>
                <Text {...fontStyle.heading6bold}>
                  Attachment
                </Text>
                <Text>
                  You can attach photo of issue (or screenshot), optional.
                </Text>
              </Stack>

              <UploadImage
                setValue={setAttachment}
                value={attachment}
              />
            </Stack>

            <Stack spacing="20px">
              <Stack>
                <Text {...fontStyle.heading6bold}>
                  Your Identity
                </Text>
                <Text>
                  We will let you know if the issue is resolved.
                </Text>
              </Stack>

              <Stack>
                <Input
                  isInvalid={errorField.includes("name")}
                  onChange={e => setName(e.target.value)}
                  placeholder="Name"
                  value={name}
                />
              </Stack>

              <Stack>
                <Input
                  isInvalid={errorField.includes("email")}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  value={email}
                  type="email"
                />
              </Stack>
            </Stack>

            <Skeleton
              isLoaded={departments.isFetched}
              borderRadius="10px"
            >
              <Stack
                borderRadius="10px"
                bgColor="gray.50"
                spacing="20px"
                p="20px"
              >
                <Stack>
                  <Text {...fontStyle.heading6bold}>
                    Detail (Recommended)
                  </Text>
                  <Text>
                    So that your ticket will directly addressed to the relevant department.
                  </Text>
                </Stack>

                <Stack>
                  <Select
                    onChange={e => setDepartmentId(e.target.value)}
                    placeholder="Select department"
                    value={departmentId}
                  >
                    {departments.data?.map((department) => (
                      <option value={department.id} key={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Select>
                </Stack>

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing="20px"
                >
                  {typeOptions.map((typeOption) => (
                    <CustomCheckbox
                      onClick={() => onClickType(typeOption.value)}
                      isActive={type === typeOption.value}
                      description={typeOption.description}
                      value={typeOption.value}
                      title={typeOption.title}
                    />
                  ))}
                </SimpleGrid>

              </Stack>
            </Skeleton>

            <Button
              rightIcon={<Iconify icon="bxs:send" />}
              isLoading={isSubmitting.get}
              onClick={onClickKirim}
              colorScheme="blue"
              w="100%"
            >
              Send Ticket
            </Button>
          </Stack>
        )}
      </Center>
    </LayoutGuest>
  );
};
