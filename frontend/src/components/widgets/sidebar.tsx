import { PatientCard } from "@/components/cards/patient.card";
import { IconInput } from "@/components/ui/input";
import { PatientStore } from "@/stores/patient.store";
import { PlusIcon, SearchIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../ui/button";
import { showModal } from "./modal/show";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PatientCSVUploadModal } from "./modal/patient-data.modal";

export const Sidebar = observer(() => {
  const vm = PatientStore;

  return (
    <aside className="flex flex-col bg-card py-5 min-w-[400px] h-full overflow-hidden">
      <div className="px-6">
        <IconInput placeholder="Введите имя" rightIcon={<SearchIcon />} />
      </div>
      <h2 className="px-6 py-5 font-semibold text-sm text-slate-500">
        Мои пациенты
      </h2>
      <ul className="flex-1 flex flex-col overflow-auto">
        {vm.patients.map((v) => (
          <PatientCard key={v.id} item={v} />
        ))}
      </ul>
      <div className="px-6 pt-2">
        <PatientCSVUploadModal />
      </div>
      {/* <div className="px-6 pt-2">
        <Button className="w-full" onClick={() => showModal()}>
          <PlusIcon />
          Добавить пациента
        </Button>
      </div> */}
      {/* <Pagination /> */}
    </aside>
  );
});
