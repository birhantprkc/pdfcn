import { CommandBox } from "@/components/command-box";
import { HomeCtas } from "@/components/home-ctas";
import { PageTransition } from "@/components/page-transition";
import { PdfPreview } from "@/components/pdf-preview-wrapper";
import { ROUTES } from "@/constants/routes";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const revalidate = false;

const IndexPage = () => (
  <>
    <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
    <PageTransition>
      <section className="container-wrapper relative">
        <div className="container flex flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24">
          <h1 className="max-w-7xl bg-linear-to-b from-foreground via-foreground to-foreground/65 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            pdfcn
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            PDF components for Takumi and Forme — invoices, reports, and
            primitives with live preview. Install with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
              npx shadcn add
            </code>
            .
          </p>

          <CommandBox className="mt-4 w-full max-w-xl" />

          <HomeCtas className="mt-4" />
        </div>
      </section>

      <section className="container-wrapper pb-8 lg:pb-12">
        <div className="container flex flex-col items-center gap-6">
          <PdfPreview
            base="takumi"
            className="w-full max-w-2xl"
            name="invoice-minimal"
          />
        </div>
      </section>
    </PageTransition>
  </>
);
export default IndexPage;
