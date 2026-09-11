import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

export const Announcement = () => (
  <Badge asChild variant="secondary" className="rounded-full">
    <Link href={ROUTES.THEME_BUILDER}>
      New Theme builder <ArrowRightIcon />
    </Link>
  </Badge>
);
