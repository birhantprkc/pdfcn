import { Document, Page } from "@formepdf/react";

import { DataTable, Heading, Section } from "@/registry/bases/forme/components";

const DemoBody = () => (
  <Section spacing="none">
    <Heading level={3}>Team Directory</Heading>
    <DataTable
      size="compact"
      variant="striped"
      columns={[
        { key: "id", header: "ID", align: "center" },
        { key: "name", header: "Name" },
        { key: "dept", header: "Department" },
        { key: "status", header: "Status", align: "center" },
      ]}
      data={[
        { id: 1, name: "Alice Johnson", dept: "Engineering", status: "Active" },
        { id: 2, name: "Bob Smith", dept: "Marketing", status: "Active" },
        { id: 3, name: "Carol Lee", dept: "Design", status: "Inactive" },
        { id: 4, name: "Dan Wilson", dept: "Engineering", status: "Active" },
        { id: 5, name: "Eve Brown", dept: "Sales", status: "Active" },
        { id: 6, name: "Frank Chen", dept: "Support", status: "Active" },
        { id: 7, name: "Grace Kim", dept: "Product", status: "Active" },
        { id: 8, name: "Hank Davis", dept: "Marketing", status: "Inactive" },
      ]}
    />
  </Section>
);

const Demo = () => {
  return (
    <Document>
      <Page size="A4" margin={40}>
        <DemoBody />
      </Page>
    </Document>
  );
};

export default Demo;
