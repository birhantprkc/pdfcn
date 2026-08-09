import type { ComponentType } from "react";

import takumi_alert from "@/examples/takumi/alert";
import takumi_badge from "@/examples/takumi/badge";
import takumi_card from "@/examples/takumi/card";
import takumi_data_table from "@/examples/takumi/data-table";
import takumi_divider from "@/examples/takumi/divider";
import takumi_form from "@/examples/takumi/form";
import takumi_graph from "@/examples/takumi/graph";
import takumi_heading from "@/examples/takumi/heading";
import takumi_invoice_classic from "@/examples/takumi/invoice-classic";
import takumi_invoice_consultant from "@/examples/takumi/invoice-consultant";
import takumi_invoice_corporate from "@/examples/takumi/invoice-corporate";
import takumi_invoice_creative from "@/examples/takumi/invoice-creative";
import takumi_invoice_minimal from "@/examples/takumi/invoice-minimal";
import takumi_invoice_modern from "@/examples/takumi/invoice-modern";
import takumi_keep_together from "@/examples/takumi/keep-together";
import takumi_key_value from "@/examples/takumi/key-value";
import takumi_link from "@/examples/takumi/link";
import takumi_list from "@/examples/takumi/list";
import takumi_page_break from "@/examples/takumi/page-break";
import takumi_page_footer from "@/examples/takumi/page-footer";
import takumi_page_header from "@/examples/takumi/page-header";
import takumi_page_number from "@/examples/takumi/page-number";
import takumi_pdf_image from "@/examples/takumi/pdf-image";
import takumi_qrcode from "@/examples/takumi/qrcode";
import takumi_report_financial from "@/examples/takumi/report-financial";
import takumi_report_marketing from "@/examples/takumi/report-marketing";
import takumi_report_operations from "@/examples/takumi/report-operations";
import takumi_report_security from "@/examples/takumi/report-security";
import takumi_section from "@/examples/takumi/section";
import takumi_signature from "@/examples/takumi/signature";
import takumi_stack from "@/examples/takumi/stack";
import takumi_table from "@/examples/takumi/table";
import takumi_text from "@/examples/takumi/text";
import takumi_watermark from "@/examples/takumi/watermark";

export type DemoName = string;
type DemoMap = Record<string, ComponentType>;

export const demos: DemoMap = {
  alert: takumi_alert,
  badge: takumi_badge,
  card: takumi_card,
  "data-table": takumi_data_table,
  divider: takumi_divider,
  form: takumi_form,
  graph: takumi_graph,
  heading: takumi_heading,
  "invoice-classic": takumi_invoice_classic,
  "invoice-consultant": takumi_invoice_consultant,
  "invoice-corporate": takumi_invoice_corporate,
  "invoice-creative": takumi_invoice_creative,
  "invoice-minimal": takumi_invoice_minimal,
  "invoice-modern": takumi_invoice_modern,
  "keep-together": takumi_keep_together,
  "key-value": takumi_key_value,
  link: takumi_link,
  list: takumi_list,
  "page-break": takumi_page_break,
  "page-footer": takumi_page_footer,
  "page-header": takumi_page_header,
  "page-number": takumi_page_number,
  "pdf-image": takumi_pdf_image,
  qrcode: takumi_qrcode,
  "report-financial": takumi_report_financial,
  "report-marketing": takumi_report_marketing,
  "report-operations": takumi_report_operations,
  "report-security": takumi_report_security,
  section: takumi_section,
  signature: takumi_signature,
  stack: takumi_stack,
  table: takumi_table,
  text: takumi_text,
  watermark: takumi_watermark,
};
