import { Document, Page } from "@formepdf/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from "@/registry/bases/forme/components";
import { PdfcnThemeProvider } from "@/registry/bases/forme/lib/pdfcn-theme-context";

const Demo = () => (
  <Document>
    <Page size="A4" margin={48}>
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
export default Demo;
