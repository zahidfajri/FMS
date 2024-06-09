import {
  Checkbox,
  Input,
  Link,
  Skeleton,
  Spacer,
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
import { useEffect, useState } from "react";

export default function AllTickets() {
  function useSearchWithCooldownState(cooldown: number = 200) {
    const [tempSearchKeyword, setTempSearchKeyword] = useState("");
    const [get, setSearchKeyword] = useState("");
    function set(value: string) {
      setTempSearchKeyword(value);
      setSearchKeyword(value);
    }
    function reset() {
      set("");
    }
    const [isCooldown, setIsCooldown] = useState(false);
    useEffect(() => {
      if (isCooldown) {
        const cooldownTimeout = setTimeout(() => {
          setSearchKeyword(tempSearchKeyword);
          setIsCooldown(false);
        }, cooldown);
        return () => clearTimeout(cooldownTimeout);
      }
    }, [isCooldown, tempSearchKeyword]);
    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTempSearchKeyword(event.target.value);
      setIsCooldown(true);
    };
    return {
      get,
      set,
      reset,
      props: {
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          handleChangeKeyword(e),
        value: tempSearchKeyword,
      },
    };
  }

  const search = useSearchWithCooldownState();
  const [isSolvedOnly, setIsSolvedOnly] = useState(false);

  const countAllTicket = api.ticket.getCountAllTicket.useQuery({
    isSolvedOnly: isSolvedOnly,
    search: search.get,
  });
  const pagination = usePagination(countAllTicket.data ?? 0);

  const tickets = api.ticket.getAllTicket.useQuery({
    isSolvedOnly: isSolvedOnly,
    limit: pagination.currentLimit,
    page: pagination.currentPage,
    search: search.get,
  });

  useEffect(() => {
    pagination.reset();
  }, [countAllTicket.data])

  return (
    <Stack spacing="10px">
      <Stack>
        <Text {...fontStyle.heading6bold}>
          All Ticket
        </Text>
        <Text>
          Showing <Text as="span" fontWeight={700}>{countAllTicket.data ?? 0}</Text> tickets.
        </Text>
      </Stack>
      <Stack
        direction={["column", "column", "row"]}
        w="100%"
      >
        <Input
          placeholder="Search ticket..."
          {...search.props}
          type="search"
          maxW="200px"
          size="sm"
        />
        <Spacer />
        <Checkbox
          onChange={e => setIsSolvedOnly(e.target.checked)}
          isChecked={isSolvedOnly}
        >
          <Text {...fontStyle.body1bold}>
            Show Solved Only
          </Text>
        </Checkbox>
      </Stack>
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