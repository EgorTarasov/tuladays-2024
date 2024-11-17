import { PatientCard } from "@/components/cards/patient.card";
import { IconInput } from "@/components/ui/input";
import { PatientStore } from "@/stores/patient.store";
import { Loader2, LogOut, Menu, SearchIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { PatientCSVUploadModal } from "./modal/patient-data.modal";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Button, buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useLocation } from "@tanstack/react-router";

export const SidebarContent = observer(() => {
  const [search, setSearch] = useState("");
  const vm = PatientStore;

  const patients = vm.patients.filter((v) =>
    `${v.first_name} ${v.last_name} ${v.middle_name}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="px-6">
        <IconInput
          placeholder="Введите имя"
          value={search}
          onChange={(v) => setSearch(v.target.value)}
          rightIcon={<SearchIcon />}
        />
      </div>
      <h2 className="px-6 py-5 font-semibold text-sm text-slate-500">
        Мои пациенты
      </h2>
      <ul className="flex-1 flex flex-col overflow-auto">
        {vm.loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>
            {patients.map((v) => (
              <PatientCard key={v.id} item={v} />
            ))}
            {patients.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <p className="text-sm text-slate-500">Пациентов не найдено</p>
              </div>
            )}
          </>
        )}
      </ul>
      <div className="px-6 pt-2">
        <PatientCSVUploadModal />
      </div>
    </>
  );
});

export const SidebarMobile = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      defaultOpen={window.innerWidth < 768}
    >
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "flex md:hidden",
        )}
      >
        <Menu />
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh] overflow-hidden h-full pb-10">
        <SidebarContent />
        <Button variant="outline" className="w-full mt-4">
          <LogOut />
          Выход
        </Button>
      </DrawerContent>
    </Drawer>
  );
};

export const Sidebar = observer(() => {
  return (
    <aside className="hidden md:flex flex-col bg-card py-5 w-full md:max-w-[480px] h-full overflow-hidden">
      <SidebarContent />
    </aside>
  );
});
