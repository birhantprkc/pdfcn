<p align="center">
  <img src="https://pdfcn.vercel.app/og" alt="pdfcn banner" />
</p>

<h1 align="center">pdfcn</h1>

<p align="center">
  A shadcn registry of PDF components for <strong>Takumi PDF</strong> and <strong>Forme PDF</strong> — invoices, reports, tables, and primitives with live PDF preview.
  <br />
  <br />
  100% catalog parity with <a href="https://github.com/akii09/pdfx">pdfx</a> across both bases.
</p>

## Bases

| Base     | Generate                                                  | Browser preview                                     |
| -------- | --------------------------------------------------------- | --------------------------------------------------- |
| `takumi` | [`takumi-pdf`](https://takumi.kane.tw/docs/pdf)           | [react-pdf](https://github.com/wojtekmaj/react-pdf) |
| `forme`  | [`@formepdf/react`](https://docs.formepdf.com/quickstart) | `@formepdf/core` / browser                          |

## Install

```bash
npx shadcn@latest add @pdfcn/takumi/text
npx shadcn@latest add @pdfcn/forme/invoice-minimal
```

## Develop

```bash
pnpm install
pnpm registry:build
pnpm dev
```

## Structure

```
registry/
  bases/
    takumi/   # components, blocks, lib
    forme/    # same catalog
  themes/     # shared PdfcnTheme tokens
examples/
  takumi/
  forme/
```
