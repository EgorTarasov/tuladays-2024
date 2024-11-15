import { checkAuth } from "@/utils/routes/check-grant";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: Outlet,
  beforeLoad: checkAuth,
});
