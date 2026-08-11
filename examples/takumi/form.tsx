import { PdfForm } from "@/registry/bases/takumi/components";
import { Document, Page } from "@/registry/bases/takumi/lib/pdfcn-primitives";
import { PdfcnThemeProvider } from "@/registry/bases/takumi/lib/theme-provider";

const DemoBody = () => (
  <PdfForm
    title="Job Application"
    subtitle="Please complete all fields clearly in block capitals."
    variant="underline"
    groups={[
      {
        title: "Personal Information",
        fields: [
          { label: "Full Name", hint: "First and last name" },
          { label: "Date of Birth", hint: "DD / MM / YYYY" },
          { label: "Email Address" },
          { label: "Phone Number", hint: "+1 (555) 000-0000" },
        ],
      },
      {
        title: "Address",
        layout: "two-column",
        fields: [
          { label: "Street Address", width: "100%" },
          { label: "City" },
          { label: "State / Province" },
          { label: "Postal Code" },
        ],
      },
      {
        title: "Additional Information",
        fields: [{ label: "Cover Letter", height: 60 }],
      },
    ]}
  />
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider>
          <DemoBody />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
};

export default Demo;
