import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModalFC } from "../widgets/modal/types";
import { DrugDto } from "@/api/models/drug.model";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { DrugEndpoint } from "@/api/endpoints/drug.endpoint";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DrugSelect } from "../widgets/drug-select";
import { useState } from "react";
import { DrugsStore } from "@/stores/drugs.store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const DrugForm: ModalFC<{ used: DrugDto.Item[] }, DrugDto.Item> = (
  x,
) => {
  const form = useForm({
    resolver: zodResolver(DrugDto.Create),
  });
  const [selectedDrug, setSelectedDrug] = useState<DrugDto.Item | undefined>();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as any;

    const name = form.name.value;
    if (!name.trim()) {
      toast.error("Название не может быть пустым");
      return;
    }

    const dosageQuantity = form.dosageQuantity.value;
    if (!dosageQuantity.trim() || isNaN(+dosageQuantity)) {
      toast.error("Неверное значение количества");
      return;
    }

    const dosageFrequencyPerDay = form.dosageFrequencyPerDay.value;
    if (!dosageFrequencyPerDay.trim() || isNaN(+dosageFrequencyPerDay)) {
      toast.error("Неверное значение частоты");
      return;
    }

    const treatmentDurationDays = form.treatmentDurationDays.value;
    if (!treatmentDurationDays.trim() || isNaN(+treatmentDurationDays)) {
      toast.error("Неверное значение длительности");
      return;
    }

    const create: DrugDto.Create = {
      name,
      dosage: {
        quantity: +dosageQuantity,
        frequencyPerDay: +dosageFrequencyPerDay,
      },
      treatmentDurationDays: +treatmentDurationDays,
      schedule: [],
    };

    const created = await DrugEndpoint.create(create);
    const res = await DrugEndpoint.getById(created.id);
    DrugsStore.init();
    x.done(res);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Новое лекарство</DialogTitle>
        <DialogDescription>Укажите информацию о назначении</DialogDescription>
      </DialogHeader>
      <Tabs defaultValue="used">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="used">
            Существующее лекарство
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="new">
            Новое лекарство
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Label>
              Название
              <Input className="mt-1" name="name" />
            </Label>
            <Label>
              Количество
              <Input className="mt-1" name="dosageQuantity" />
            </Label>
            <Label>
              Частота
              <Input className="mt-1" name="dosageFrequencyPerDay" />
            </Label>
            <Label>
              Длительность
              <Input className="mt-1" name="treatmentDurationDays" />
            </Label>
            <DialogFooter>
              <Button type="submit">Создать</Button>
            </DialogFooter>
          </form>
        </TabsContent>
        <TabsContent value="used">
          <DrugSelect usedDrugs={x.used} onSelect={setSelectedDrug} />
          <DialogFooter className="mt-4">
            <Button
              disabled={!selectedDrug}
              onClick={() => x.done(selectedDrug)}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </TabsContent>
      </Tabs>
    </>
  );
};
