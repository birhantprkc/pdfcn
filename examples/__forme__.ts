import type { ComponentType } from "react";

import forme_alert from "@/examples/forme/alert";
import forme_badge from "@/examples/forme/badge";
import forme_card from "@/examples/forme/card";
import forme_data_table from "@/examples/forme/data-table";
import forme_divider from "@/examples/forme/divider";
import forme_form from "@/examples/forme/form";
import forme_graph from "@/examples/forme/graph";
import forme_heading from "@/examples/forme/heading";
import forme_invoice_classic from "@/examples/forme/invoice-classic";
import forme_invoice_consultant from "@/examples/forme/invoice-consultant";
import forme_invoice_corporate from "@/examples/forme/invoice-corporate";
import forme_invoice_creative from "@/examples/forme/invoice-creative";
import forme_invoice_minimal from "@/examples/forme/invoice-minimal";
import forme_invoice_modern from "@/examples/forme/invoice-modern";
import forme_keep_together from "@/examples/forme/keep-together";
import forme_key_value from "@/examples/forme/key-value";
import forme_link from "@/examples/forme/link";
import forme_list from "@/examples/forme/list";
import forme_page_break from "@/examples/forme/page-break";
import forme_page_footer from "@/examples/forme/page-footer";
import forme_page_header from "@/examples/forme/page-header";
import forme_page_number from "@/examples/forme/page-number";
import forme_pdf_image from "@/examples/forme/pdf-image";
import forme_qrcode from "@/examples/forme/qrcode";
import forme_report_financial from "@/examples/forme/report-financial";
import forme_report_marketing from "@/examples/forme/report-marketing";
import forme_report_operations from "@/examples/forme/report-operations";
import forme_report_security from "@/examples/forme/report-security";
import forme_section from "@/examples/forme/section";
import forme_signature from "@/examples/forme/signature";
import forme_stack from "@/examples/forme/stack";
import forme_table from "@/examples/forme/table";
import forme_text from "@/examples/forme/text";
import forme_watermark from "@/examples/forme/watermark";

export type DemoName = string;
type DemoMap = Record<string, ComponentType>;

export const demos: DemoMap = {
  alert: forme_alert,
  badge: forme_badge,
  card: forme_card,
  "data-table": forme_data_table,
  divider: forme_divider,
  form: forme_form,
  graph: forme_graph,
  heading: forme_heading,
  "invoice-classic": forme_invoice_classic,
  "invoice-consultant": forme_invoice_consultant,
  "invoice-corporate": forme_invoice_corporate,
  "invoice-creative": forme_invoice_creative,
  "invoice-minimal": forme_invoice_minimal,
  "invoice-modern": forme_invoice_modern,
  "keep-together": forme_keep_together,
  "key-value": forme_key_value,
  link: forme_link,
  list: forme_list,
  "page-break": forme_page_break,
  "page-footer": forme_page_footer,
  "page-header": forme_page_header,
  "page-number": forme_page_number,
  "pdf-image": forme_pdf_image,
  qrcode: forme_qrcode,
  "report-financial": forme_report_financial,
  "report-marketing": forme_report_marketing,
  "report-operations": forme_report_operations,
  "report-security": forme_report_security,
  section: forme_section,
  signature: forme_signature,
  stack: forme_stack,
  table: forme_table,
  text: forme_text,
  watermark: forme_watermark,
};
