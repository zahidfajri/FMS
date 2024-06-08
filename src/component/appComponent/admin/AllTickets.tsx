import {
  Checkbox,
  HStack,
  Link,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { fontStyle } from "@dbb-id/standarization";
import AdminPaginationFooter from "./AdminPaginationFooter";
import { api } from "~/utils/api";
import { usePagination } from "~/utils/pagination";
import { useState } from "react";

export default function AllTickets() {

  const [isSolvedOnly, setIsSolvedOnly] = useState(false);

  const countAllTicket = api.ticket.getCountAllTicket.useQuery({
    isSolvedOnly: isSolvedOnly
  });
  const pagination = usePagination(countAllTicket.data ?? 0);

  const tickets = api.ticket.getAllTicket.useQuery({
    isSolvedOnly: isSolvedOnly,
    limit: pagination.currentLimit,
    page: pagination.currentPage
  });

  return (
    <Stack>
      <HStack w="100%" justify="space-between">
        <Text {...fontStyle.heading6bold}>
          All Ticket
        </Text>
        <Checkbox
          onChange={e => setIsSolvedOnly(e.target.checked)}
          isChecked={isSolvedOnly}
        >
          <Text {...fontStyle.body1bold}>
            Show Solved Only
          </Text>
        </Checkbox>
      </HStack>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>
                No
              </Th>
              <Th>
                Code
              </Th>
              <Th>
                Title
              </Th>
              <Th>
                Department
              </Th>
              <Th>
                Type
              </Th>
              <Th>
                Status
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tickets.isFetching
              ? Array(pagination.currentLimit)
                .fill("")
                .map((_, index) => (
                  <Tr key={index} h="73px">
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>
                ))
              : tickets.data?.map((ticket, index) => (
                <Tr
                  key={ticket.id}
                  h="73px"
                >
                  <Td>
                    {(pagination.currentPage * pagination.currentLimit) + (index + 1)}
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/ticket/${ticket.code}`}
                      isExternal
                    >
                      {ticket.code}
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/ticket/${ticket.code}`}
                      isExternal
                    >
                      {ticket.title}
                    </Link>
                  </Td>
                  <Td>
                    {ticket.department?.name ?? (
                      <Link
                        href={`/admin/ticket/${ticket.code}`}
                        fontWeight={600}
                        color="red.500"
                        isExternal
                      >
                        unassigned
                      </Link>
                    )}
                  </Td>
                  <Td>
                    {ticket.type ?? (
                      <Link
                        href={`/admin/ticket/${ticket.code}`}
                        fontWeight={600}
                        color="red.500"
                        isExternal
                      >
                        no type
                      </Link>
                    )}
                  </Td>
                  <Td>
                    {ticket.isSolved ? "Solved" : "Not Solved Yet"}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      <AdminPaginationFooter {...pagination.props} />
    </Stack>
  )
}