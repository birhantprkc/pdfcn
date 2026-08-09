import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Table } from "@/registry/bases/takumi/components/table";
import { TableBody, TableCell, TableHeader, TableRow, Text } from "@/registry/bases/takumi/components";

const Demo =() => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
        <DemoBody />
        </PdfcnThemeProvider>
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
