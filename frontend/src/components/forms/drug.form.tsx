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
import { Field, Form } from "../ui/form";
import { X } from "lucide-react";

export const DrugForm: ModalFC<{ used: DrugDto.Item[] }, DrugDto.Item> = (
  x,
) => {
  const form = useForm<DrugDto.Create>({
    resolver: zodResolver(DrugDto.Create),
    defaultValues: {
      schedule: [],
    },
  });
  const [selectedDrug, setSelectedDrug] = useState<DrugDto.Item | undefined>();

  const submit = async (v: DrugDto.Create) => {
    const created = await DrugEndpoint.create(v);
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="flex flex-col gap-4"
            >
              <Field
                control={form.control}
                component={(x) => <Input {...x} />}
                name="name"
                label="Название"
              />
              <Field
                control={form.control}
                component={(x) => (
                  <Input
                    {...x}
                    type="number"
                    onChange={(v) =>
                      form.setValue("dosage.quantity", v.target.valueAsNumber)
                    }
                  />
                )}
                name="dosage.quantity"
                label="Количество"
              />
              <Field
                control={form.control}
                component={(x) => (
                  <Input
                    {...x}
                    type="number"
                    onChange={(v) =>
                      form.setValue(
                        "dosage.frequencyPerDay",
                        v.target.valueAsNumber,
                      )
                    }
                  />
                )}
                name="dosage.frequencyPerDay"
                label="Частота"
              />
              <Field
                control={form.control}
                component={(x) => (
                  <Input
                    {...x}
                    type="number"
                    onChange={(v) =>
                      form.setValue(
                        "treatmentDurationDays",
                        v.target.valueAsNumber,
                      )
                    }
                  />
                )}
                name="treatmentDurationDays"
                label="Длительность"
              />
              {/* schedule: z.array(z.string().regex(/^\d{2}:\d{2}$/)), // календарь приема лекарства (HH:MM)[] */}
              <ul className="flex flex-col gap-2">
                {form.watch("schedule").map((x, i) => (
                  <li key={i} className="flex items-end gap-2">
                    <Field
                      control={form.control}
                      className="flex-1"
                      component={(x) => <Input {...x} placeholder="ЧЧ:ММ" />}
                      name={`schedule.${i}`}
                      label={`Время приема ${i + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        form.setValue(
                          "schedule",
                          form.watch("schedule").filter((_, j) => j !== i),
                        )
                      }
                    >
                      <X />
                    </Button>
                  </li>
                ))}
                <Button
                  type="button"
                  onClick={() =>
                    form.setValue("schedule", [...form.watch("schedule"), ""])
                  }
                >
                  Добавить время приема
                </Button>
              </ul>
              <DialogFooter>
                <Button type="submit">Создать</Button>
              </DialogFooter>
            </form>
          </Form>
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
