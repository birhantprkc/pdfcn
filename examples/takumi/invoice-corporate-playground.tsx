const sampleData = {
  billTo: {
    address: "100 Corporate Plaza, Tower B",
    email: "accounts@globalindustries.com",
    name: "Global Industries Ltd.",
    phone: "+1 (555) 888-9999",
  },
  companyAddress: "City, Country",
  companyName: "Your Company",
  dueDate: "March 24, 2026",
  invoiceDate: "February 22, 2026",
  invoiceNumber: "INV-2026-004",
  items: [
    {
      description: "Enterprise Software License",
      quantity: 5,
      unitPrice: 4500,
    },
    { description: "Implementation Services", quantity: 1, unitPrice: 18_000 },
    { description: "Training Workshop", quantity: 3, unitPrice: 2500 },
    { description: "Annual Support Package", quantity: 1, unitPrice: 8500 },
  ],
  notes: "Corporate billing – Net 30 terms apply.",
  paymentTerms: {
    dueDate: "March 24, 2026",
    gst: "GSTIN 987654321",
    method: "Wire Transfer / Corporate Account",
  },
  subtitle: "Professional Services",
  summary: { subtotal: 57_000, tax: 4560, total: 61_560 },
};

const money = (v: number) => `$${v.toLocaleString("en-US")}`;

export default function InvoiceCorporate() {
  const d = sampleData;
  return (
    <div tw="flex w-full flex-col text-[#30313d]">
      <div tw="flex items-start justify-between">
        <div tw="flex flex-col">
          <h1 tw="m-0 text-2xl font-semibold">Invoice {d.invoiceNumber}</h1>
          <p tw="mt-2 mb-0 text-xs text-[#687385]">
            Issued {d.invoiceDate} · Due {d.dueDate}
          </p>
        </div>
        <span tw="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4338ca]">
          Pending
        </span>
      </div>

      <div tw="mt-8 flex text-xs">
        <div tw="flex w-[240px] flex-col">
          <span tw="mb-1 font-semibold text-[#687385]">From</span>
          <span>{d.companyName}</span>
          <span tw="text-[#687385]">{d.companyAddress}</span>
        </div>
        <div tw="flex w-[240px] flex-col">
          <span tw="mb-1 font-semibold text-[#687385]">Bill To</span>
          <span>{d.billTo.name}</span>
          <span tw="text-[#687385]">{d.billTo.address}</span>
          <span tw="text-[#687385]">{d.billTo.email}</span>
          <span tw="text-[#687385]">{d.billTo.phone}</span>
        </div>
      </div>

      <div tw="mt-8 flex border-b border-[#ebeef1] pb-2 text-[11px] font-semibold text-[#687385]">
        <span tw="flex-1">Description</span>
        <span tw="w-[60px] text-right">Qty</span>
        <span tw="w-[100px] text-right">Unit Price</span>
        <span tw="w-[100px] text-right">Amount</span>
      </div>
      {d.items.map((item) => (
        <div key={item.description} tw="flex break-inside-avoid pt-3 text-xs">
          <span tw="flex-1">{item.description}</span>
          <span tw="w-[60px] text-right text-[#687385]">{item.quantity}</span>
          <span tw="w-[100px] text-right text-[#687385]">
            {money(item.unitPrice)}
          </span>
          <span tw="w-[100px] text-right">
            {money(item.quantity * item.unitPrice)}
          </span>
        </div>
      ))}

      <div tw="mt-8 flex break-inside-avoid justify-end">
        <div tw="flex w-[260px] flex-col text-xs">
          <div tw="flex justify-between">
            <span tw="text-[#687385]">Subtotal</span>
            <span>{money(d.summary.subtotal)}</span>
          </div>
          <div tw="mt-2 flex justify-between">
            <span tw="text-[#687385]">Tax (8%)</span>
            <span>{money(d.summary.tax)}</span>
          </div>
          <div tw="mt-3 flex justify-between border-t border-[#ebeef1] pt-3 text-sm font-semibold">
            <span>Total Due</span>
            <span>{money(d.summary.total)}</span>
          </div>
        </div>
      </div>

      <div tw="mt-8 text-xs text-[#687385]">
        <p tw="m-0">Payment Terms: {d.paymentTerms.method}</p>
        <p tw="m-0 mt-1">Due: {d.paymentTerms.dueDate}</p>
        <p tw="m-0 mt-1">{d.paymentTerms.gst}</p>
      </div>

      {d.notes && <p tw="mt-8 mb-0 text-[11px] text-[#687385]">{d.notes}</p>}
    </div>
  );
}

export const options: PlaygroundOptions = {
  pdf: {
    margin: 48,
    size: "a4",
  },
};
