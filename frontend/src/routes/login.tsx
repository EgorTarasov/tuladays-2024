import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Page = () => {};

export const Route = createFileRoute("/login")({
  component: Page,
  validateSearch: zodSearchValidator(
    z.object({
      redirect: fallback(z.string().optional(), undefined),
    }),
  ),
});
