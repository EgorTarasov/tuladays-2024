import { DrugForm } from "@/components/forms/drug.form";
import { Button } from "@/components/ui/button";
import { showModal } from "@/components/widgets/modal/show";
import { Sidebar, SidebarMobile } from "@/components/widgets/sidebar";
import { AuthService } from "@/stores/auth.service";
import { checkDoctor } from "@/utils/routes/check-grant";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { LogOut } from "lucide-react";
import { useRef } from "react";
import { z } from "zod";

const search = z.object({
  search: fallback(z.string().optional(), ""),
});

const Page = () => {
  const navigate = useNavigate();

  return (
    <div className="flex size-full">
      <Sidebar />
      <div className="absolute right-4 top-4 flex gap-x-2">
        <Button
          variant="ghost"
          onClick={() => {
            AuthService.logout();
            navigate({ to: "/login" });
          }}
          className="md:flex hidden"
        >
          <LogOut />
          Выход
        </Button>
        <SidebarMobile />
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_doctor")({
  component: Page,
  beforeLoad: checkDoctor,
  validateSearch: zodSearchValidator(search),
});
