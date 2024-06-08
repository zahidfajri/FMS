import { Button, Select, Skeleton, Stack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { fontStyle } from "@dbb-id/standarization";
import { useState } from "react";
import { api } from "~/utils/api";
import { monthsName, yearsStock } from "~/utils/date";
import { CSVLink } from "react-csv";
import { useRecoilValue } from "recoil";
import { selectedDepartmentRecoil } from "~/utils/recoil";
import moment from "moment";

export default function DepartmentAnalytics({
  id,
}: {
  id: number;
}) {
  const department = useRecoilValue(selectedDepartmentRecoil);

  const now = new Date();
  const yearCode = now.getFullYear().toString().slice(2);
  const monthCode = String(now.getMonth() + 1).padStart(2, "0");

  const [monthReference, setMonthReference] = useState(monthCode);
  const [yearReference, setYearReference] = useState(yearCode);

  const tickets = api.ticket.getTicketsByDepartmentId.useQuery({
    departmentId: id,
    monthCode: monthReference,
    yearCode: yearReference,
  });
  const totalTicket = tickets.data?.length ?? 0;
  const totalInquiry = tickets.data?.filter(ticket => ticket.type === "INQUIRY").length ?? 0;
  const totalComplaint = tickets.data?.filter(ticket => ticket.type === "COMPLAINT").length ?? 0;
  const totalSuggestion = tickets.data?.filter(ticket => ticket.type === "SUGGESTION").length ?? 0;
  const totalCompliment = tickets.data?.filter(ticket => ticket.type === "COMPLIMENT").length ?? 0;
  const totalUntyped = tickets.data?.filter(ticket => ticket.type === null).length ?? 0;
  const datas = [
    {
      title: "INQUIRY",
      bgColor: "blue.500",
      total: totalInquiry,
    },
    {
      title: "COMPLAINT",
      bgColor: "red.500",
      total: totalComplaint,
    },
    {
      title: "SUGGESTION",
      bgColor: "yellow.500",
      total: totalSuggestion,
    },
    {
      title: "COMPLIMENT",
      bgColor: "green.500",
      total: totalCompliment,
    },
    {
      title: "NO TYPE",
      bgColor: "gray.700",
      total: totalUntyped,
    },
  ];

  const header = ['ID', 'Department', 'Type', 'Title', 'Description', 'Attachment', 'solvedAt']
  const body: string[][] = tickets.data?.map(ticket => ([
    ticket.code,
    department?.name ?? "(unable to load)",
    ticket.type ?? "-",
    ticket.title,
    ticket.subtitle,
    ticket.attachment ?? "-",
    ticket.solvedAt ? moment(ticket.solvedAt).format("H:mm:ss DD-MM-YYYY") : "-",
  ])) ?? [];

  return (
    <Stack
      borderRadius="20px"
      borderWidth="1px"
      spacing="20px"
      p="20px"
    >
      <Stack
        alignItems={["start", "start", "center"]}
        direction={["column", "column", "row"]}
        justify="space-between"
        w="100%"
      >
        <Stack>
          <Text {...fontStyle.heading5bold}>
            Analytics
          </Text>
          <Text>
            This is department's monthly report tickets. You can see all detail by click Download CSV.
          </Text>
        </Stack>
        <CSVLink
          style={{
            pointerEvents: tickets.isFetching ? "none" : undefined,
            height: "fit-content",
            width: "fit-content",
          }}
          filename={`report-${department?.name ?? "unknown"}-${yearCode}${monthCode}.csv`}
          headers={header}
          data={body}
        >
          <Button
            isDisabled={tickets.isFetching}
            colorScheme="blue"
          >
            Download CSV
          </Button>
        </CSVLink>
      </Stack>
      <Stack
        alignItems={["start", "start", "center"]}
        direction={["column", "column", "row"]}
      >
        <Text {...fontStyle.heading6bold}>
          Month:
        </Text>
        <Select
          onChange={e => setMonthReference(e.target.value)}
          value={monthReference}
          w="fit-content"
          size="lg"
        >
          {monthsName.map(month => (
            <option value={month.code} key={month.code}>
              {month.name}
            </option>
          ))}
        </Select>
        <Select
          onChange={e => setYearReference(e.target.value)}
          value={yearReference}
          w="fit-content"
          size="lg"
        >
          {yearsStock.map(year => (
            <option value={year.toString().slice(2)} key={year}>
              {year}
            </option>
          ))}
        </Select>
      </Stack>
      <Text {...fontStyle.body1medium}>
        There {totalTicket === 1 ? "is" : "are"}{" "}
        <Text
          fontWeight={800}
          fontSize="18px"
          as="span"
        >
          {totalTicket === 0 ? "no" : totalTicket}
        </Text>{" "}
        tickets on{" "}
        <Text
          fontWeight={800}
          fontSize="18px"
          as="span"
        >
          {monthsName.find(mn => mn.code === monthReference)?.name} {yearsStock.find(ys => ys.toString().slice(2) === yearReference)}
        </Text> that consist of,
      </Text>
      <Wrap>
        {datas.map((data) => (
          <WrapItem
            bgColor={data.bgColor}
            borderRadius="10px"
            key={data.title}
            minW="114px"
            flex="1"
          >
            <Skeleton
              isLoaded={tickets.isFetching === false}
              borderRadius="10px"
              w="100%"
            >
              <Stack
                alignItems="center"
                textAlign="center"
                color="white"
                p="20px"
                w="100%"
              >
                <Text {...fontStyle.heading4extrabold}>
                  {data.total}
                </Text>
                <Text
                  display={["none", "none", "flex"]}
                  {...fontStyle.body1regular}
                >
                  monthly ticket are
                </Text>
                <Text
                  {...fontStyle.body1bold}
                  letterSpacing="0.5px"
                >
                  {data.title}
                </Text>
              </Stack>
            </Skeleton>
          </WrapItem>
        ))}
      </Wrap>
    </Stack>
  )
}