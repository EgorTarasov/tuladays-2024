import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthService } from "@/stores/auth.service";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModalPresenter } from "@/components/widgets/modal/modal-presenter";

const Page = React.memo(() => {
  return (
    <TooltipProvider>
      {/* <Toaster richColors theme="light" position="bottom-left" /> */}
      <ModalPresenter />
      <Outlet />
    </TooltipProvider>
  );
});

export const Route = createRootRoute({
  component: Page,
  beforeLoad: () => AuthService.waitInit(),
});
