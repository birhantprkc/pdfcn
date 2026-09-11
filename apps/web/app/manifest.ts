import type { MetadataRoute } from "next";

import { ROUTES } from "@/constants/routes";
import { SITE, META_THEME_COLORS } from "@/constants/site";

const manifest = (): MetadataRoute.Manifest => ({
  background_color: META_THEME_COLORS.light,
  description: SITE.DESCRIPTION.LONG,
  display: "standalone",
  icons: [
    {
      sizes: "192x192",
      src: "/android-chrome-192x192.png",
      type: "image/png",
    },
    {
      sizes: "512x512",
      src: "/android-chrome-512x512.png",
      type: "image/png",
    },
  ],
  name: SITE.NAME,
  short_name: SITE.NAME,
  start_url: ROUTES.HOME,
  theme_color: META_THEME_COLORS.light,
});

export default manifest;
