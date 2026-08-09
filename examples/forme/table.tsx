import { Document, Page } from "@formepdf/react";
import { Table } from "@/registry/bases/forme/components/table";
import { TableBody, TableCell, TableHeader, TableRow, Text } from "@/registry/bases/forme/components";

const Demo =() => {
  return (
    <Document>
      <Page size="A4" margin={48}>
        <DemoBody />
      </Page>
    </Document>
  );
}
export default Demo;

const DemoBody =() => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell><Text>Item</Text></TableCell>
          <TableCell><Text>Qty</Text></TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><Text>Widget</Text></TableCell>
          <TableCell><Text>2</Text></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
