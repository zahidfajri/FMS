import { Button, Input, Skeleton, Stack, Text, useToast } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { fontStyle } from "~/styles/fontStyle";
import { useBooleanState } from "~/utils/hooks";

export default function SignInComponent({
  isLoaded,
  redirectSuccess,
  title = "Login"
}: {
  isLoaded?: boolean;
  redirectSuccess?: string;
  title?: string;
}) {
  const toast = useToast();
  const router = useRouter();

  const isSigning = useBooleanState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onClickLogin() {
    isSigning.set(true);
    const response = await signIn("login", {
      email,
      password,
      redirect: false,
    });
    isSigning.set(false);
    if (response?.error) {
      toast({
        status: "error",
        title: "Invalid Credentials",
        position: "top"
      });
      return
    }
    if (redirectSuccess) router.replace(redirectSuccess);
  }

  return (
    <Stack
      alignItems="center"
      spacing="20px"
      maxW="600px"
      w="100%"
    >
      <Text
        {...fontStyle.heading3bold}
        textShadow="0px 0px 1px #4FD1C5"
        color="white"
      >
        {title}
      </Text>

      <Skeleton
        isLoaded={isLoaded}
        w="100%"
      >
        <Stack
          onSubmit={e => e.preventDefault()}
          borderColor="gray.200"
          borderRadius="20px"
          alignItems="center"
          borderWidth="1px"
          bgColor="white"
          spacing="20px"
          as="form"
          w="100%"
          p="40px"
        >
          <Stack w="100%">
            <Text fontWeight={500}>
              Email
            </Text>
            <Input
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </Stack>

          <Stack w="100%">
            <Text fontWeight={500}>
              Password
            </Text>
            <Input
              onChange={e => setPassword(e.target.value)}
              value={password}
              type="password"
            />
          </Stack>

          <Button
            isLoading={isSigning.get}
            onClick={onClickLogin}
            colorScheme="blue"
            variant="outline"
            type="submit"
          >
            Login
          </Button>
        </Stack>
      </Skeleton>
    </Stack>
  )
}