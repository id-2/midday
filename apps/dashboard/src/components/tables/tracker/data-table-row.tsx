import { FormatAmount } from "@/components/format-amount";
import { ProjectMembers } from "@/components/project-members";
import { TrackerStatus } from "@/components/tracker-status";
import { Icons } from "@midday/ui/icons";
import { TableCell, TableRow } from "@midday/ui/table";
import { cn } from "@midday/ui/utils";
import { format } from "date-fns";

export function DataTableCell({ children, className }) {
  return <TableCell className={className}>{children}</TableCell>;
}

export function Row({ onClick, children }) {
  return (
    <TableRow className="h-[45px]" onClick={onClick}>
      {children}
    </TableRow>
  );
}

export function DataTableRow({ row, setOpen }) {
  return (
    <Row key={row.id} onClick={() => setOpen(row.id)}>
      <DataTableCell>{row.name}</DataTableCell>
      <DataTableCell>{row.time}</DataTableCell>
      <DataTableCell>{row.description}</DataTableCell>
      <DataTableCell>
        <ProjectMembers members={row.members} />
      </DataTableCell>
      <DataTableCell>
        <TrackerStatus status={row.status} />
      </DataTableCell>
    </Row>
  );
}