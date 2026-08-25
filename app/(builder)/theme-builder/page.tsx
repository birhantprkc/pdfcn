import type { Metadata } from "next";

import { ThemeBuilder } from "@/components/theme-builder/theme-builder";
import { ROUTES } from "@/constants/routes";
import { createPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  description:
    "Customize pdfcn colors, typography, spacing, and page settings with a live PDF preview, then export a reusable theme.",
  path: ROUTES.THEME_BUILDER,
  title: "Theme Builder",
});

const ThemeBuilderPage = () => <ThemeBuilder />;

export default ThemeBuilderPage;
