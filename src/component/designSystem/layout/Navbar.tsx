import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Show,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Iconify from "~/component/appComponent/iconify";
import ImageWithSkeleton from "~/component/appComponent/imageComponents";
import { fontStyle } from "~/styles/fontStyle";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const session = useSession();

  return (
    <>
      <Flex
        as="nav"
        boxShadow="rgba(0, 0, 0, 0.3) 0px 20px 20px -30px"
        bgColor="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(10px)"
        position="fixed"
        justify="center"
        zIndex={5}
        top="0px"
        w="100%"
        h="80px"
      >
        <HStack
          spacing="20px"
          p="20px 40px"
          maxW="1000px"
          w="100%"
        >
          <HStack>
            <ImageWithSkeleton
              src="/northport-icon.png"
              alt="northport icon"
              height="40px"
              width="40px"
            />
            <Box
              {...fontStyle.heading5bold}
              letterSpacing="0.5px"
              color="blue.600"
            >
              Helpdesk
            </Box>
          </HStack>
          <Spacer />
          <Show above="lg">
            <Link
              href="/new-ticket"
              passHref
            >
              <Button
                colorScheme="blue"
                variant="solid"
                size="sm"
              >
                new ticket
              </Button>
            </Link>
            <Link
              href="/track"
              passHref
            >
              <Button
                colorScheme="blue"
                variant="link"
                size="md"
                p="10px"
              >
                track
              </Button>
            </Link>
            {session.data?.user ? (
              <Link
                href={session.data.user.role === "ADMIN" ? "/admin/dashboard" : "/technician/dashboard"}
                passHref
              >
                <Button
                  colorScheme="blue"
                  bgColor="blue.50"
                  variant="outline"
                  size="sm"
                  p="10px"
                >
                  dashboard
                </Button>
              </Link>
            ) : <></>}
          </Show>
          <Show below="lg">
            <Button onClick={onOpen}>
              <Iconify icon="bx:menu" />
            </Button>
            <Drawer
              onClose={onClose}
              placement="right"
              isOpen={isOpen}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader>
                  Menu
                </DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                  <Stack>
                    <Link
                      href="/new-ticket"
                      passHref
                    >
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        size="sm"
                      >
                        new ticket
                      </Button>
                    </Link>
                    <Link
                      href="/track"
                      passHref
                    >
                      <Button
                        colorScheme="blue"
                        variant="link"
                        size="md"
                        p="10px"
                      >
                        track
                      </Button>
                    </Link>
                  </Stack>
                </DrawerBody>
                <DrawerFooter>
                  Northport Helpdesk
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Show>
        </HStack>
      </Flex>
      <Flex h="80px" />
    </>
  )
}

export function NavbarAdmin() {
  const router = useRouter();
  const session = useSession();

  async function onClickSignOut() {
    signOut({
      redirect: true,
      callbackUrl: session.data?.user.role === "ADMIN" ? "/admin" : "/technician"
    });
    return;
  };

  return (
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
      <Spacer />
      {session.data?.user.role === "ADMIN" ? (
        <>
          {router.pathname !== "/admin/dashboard" ? (
            <Link
              href="/admin/dashboard"
              passHref
            >
              <Button
                colorScheme="blue"
                bgColor="blue.50"
                variant="outline"
                size="xs"
              >
                Dashboard
              </Button>
            </Link>
          ) : <></>}
        </>
      ) : <></>}
      <Button
        onClick={onClickSignOut}
        colorScheme="gray"
        bgColor="gray.50"
        variant="outline"
        size="xs"
      >
        Sign Out
      </Button>
    </HStack>
  )
}