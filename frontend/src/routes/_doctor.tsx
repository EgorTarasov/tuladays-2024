import { DrugForm } from "@/components/forms/drug.form";
import { showModal } from "@/components/widgets/modal/show";
import { Sidebar } from "@/components/widgets/sidebar";
import { checkDoctor } from "@/utils/routes/check-grant";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { useRef } from "react";
import { z } from "zod";

const search = z.object({
  search: fallback(z.string().optional(), ""),
});

const Page = () => {
  return (
    <div className="flex size-full">
      <Sidebar />
      <div className="max-w-screen-lg w-full">
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
