import { Button, Center, Flex, Stack, Text, } from "@chakra-ui/react";
import Link from "next/link";
import LayoutGuest from "~/component/designSystem/layout/Layout";
import { fontStyle } from "~/styles/fontStyle";

const IndexPage = () => {
  return (
    <LayoutGuest>
      <Center
        minH="calc(100svh - 160px)"
        p="10px"
      >
        <Stack
          backdropFilter="blur(2px)"
          borderColor="gray.200"
          borderRadius="20px"
          alignItems="center"
          spacing="20px"
          maxW="800px"
          p="40px"
        >
          <Text
            {...fontStyle.heading3bold}
            color="blackAlpha.900"
            textAlign="center"
            fontWeight={900}
          >
            Need Help with{" "}
            <Text
              color="blue.500"
              as="span"
            >
              Northport
            </Text>
            ?
          </Text>
          <Text
            {...fontStyle.body1medium}
            textAlign="center"
            color="gray.500"
            maxW="600px"
          >
            Our support team is here to assist you with any inquiries or issues you might have. Please feel free to create a ticket, and we will get back to you as soon as possible.
          </Text>
          <Flex />
          <Link
            href="/new-ticket"
            passHref
          >
            <Button colorScheme="blue">
              Create Ticket
            </Button>
          </Link>
        </Stack>
      </Center>
    </LayoutGuest>
  );
};

export default IndexPage;
