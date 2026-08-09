import { CommandBox } from "@/components/command-box";
import { HomeCtas } from "@/components/home-ctas";
import { PageHero } from "@/components/page-hero";
import { PageTransition } from "@/components/page-transition";
import { ROUTES } from "@/constants/routes";
import { BreadcrumbJsonLd } from "@/seo/json-ld";

export const revalidate = false;

const IndexPage = () => (
  <>
    <BreadcrumbJsonLd items={[{ name: "Home", path: ROUTES.HOME }]} />
    <PageTransition>
      <section className="container-wrapper relative">
        <div className="container flex flex-col items-center gap-4 py-16 text-center md:py-20 lg:py-24">
          <PageHero
            description={
              <>
                Beautiful PDFs made simple with Takumi and Forme.
                <br className="hidden sm:block" />
                Install with{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
                  npx shadcn add
                </code>
                .
              </>
            }
            descriptionClassName="max-w-2xl text-lg sm:text-xl"
            title="Beautiful PDFs made simple"
            titleClassName="max-w-7xl"
          />

          <CommandBox className="mt-4 w-full max-w-xl" />

          <HomeCtas className="mt-4" />
        </div>
      </section>
    </PageTransition>
  </>
);
export default IndexPage;
