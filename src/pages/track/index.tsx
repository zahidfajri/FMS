import { Button, Center, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import LayoutGuest from "~/component/designSystem/layout/Layout";
import { fontStyle } from "~/styles/fontStyle";

export default function TrackPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onClickTrack() {
    router.push("/track/" + code.replace("#", ""));
  }

  return (
    <LayoutGuest>
      <Center minH="calc(100svh - 160px)">
        <Stack
          backdropFilter="blur(2px)"
          borderColor="gray.200"
          borderRadius="20px"
          alignItems="center"
          borderWidth="1px"
          spacing="20px"
          maxW="600px"
          p="40px"
        >
          <Text
            {...fontStyle.heading3bold}
            color="blackAlpha.900"
            textAlign="center"
            fontWeight={900}
          >
            Pantau {" "}
            <Text
              color="blue.500"
              as="span"
            >
              Tiket{" "}
            </Text>
            Yang Kamu Kirim
          </Text>
          <Text
            {...fontStyle.body1medium}
            textAlign="center"
            color="gray.500"
          >
            Enter Your Ticket Number Received From Email
          </Text>
          <Flex />
          <Input
            onChange={e => setCode(e.target.value)}
            placeholder="Kode tiket, eg. #27"
            value={code}
          />
          <Button
            onClick={onClickTrack}
            colorScheme="blue"
            w="100%"
          >
            Track
          </Button>
        </Stack>
      </Center>
    </LayoutGuest>
  )
}