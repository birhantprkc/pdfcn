import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "@/registry/bases/takumi/components";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/pdfcn-theme-context";
import { Document, Page } from "@/registry/bases/takumi/lib/takumi-primitives";

export default function Demo() {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <Text>Item</Text>
                </TableCell>
                <TableCell>
                  <Text>Qty</Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Text>Widget</Text>
                </TableCell>
                <TableCell>
                  <Text>2</Text>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
