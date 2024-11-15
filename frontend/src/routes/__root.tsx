import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthService } from "@/stores/auth.service";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import DetailedPatientDashboard from "@/pages/dashboard";

const Page = React.memo(() => {
  return (
    <TooltipProvider>
      <Toaster richColors theme="light" position="bottom-left" />
      <DetailedPatientDashboard />
    </TooltipProvider>
  );
});

export const Route = createRootRoute({
  component: Page,
  beforeLoad: () => AuthService.waitInit(),
});
