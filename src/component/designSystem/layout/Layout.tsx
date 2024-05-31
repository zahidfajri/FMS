import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function LayoutGuest({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Box
      position="relative"
      bgSize="cover"
      minH="100svh"
    >
      <Navbar />
      {children}
    </Box>
  )
}