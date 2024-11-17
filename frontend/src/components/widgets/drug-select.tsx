"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { cn } from "@/utils/cn";
import { observer } from "mobx-react-lite";
import { DrugsStore } from "@/stores/drugs.store";

const Item = z.object({
  id: z.number(),
  name: z.string(),
  dosage: z.object({
    quantity: z.number(),
    frequencyPerDay: z.number(),
  }),
  treatmentDurationDays: z.number(),
  schedule: z.array(z.string().regex(/^\d{2}:\d{2}$/)),
  remindPatient: z.boolean(),
  disableForPatient: z.boolean(),
});

type Item = z.infer<typeof Item>;

interface DrugSelectProps {
  usedDrugs: Item[];
  onSelect: (drug: Item) => void;
}

export const DrugSelect = observer(
  ({ usedDrugs, onSelect }: DrugSelectProps) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>("");

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? DrugsStore.drugs.find((drug) => drug.name === value)?.name
              : "Выберите лекарство..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput
              placeholder="Выбрать лекарство..."
              className="w-full"
            />
            <CommandEmpty>Лекарство не найдено.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {DrugsStore.drugs
                  .filter((drug) => !usedDrugs.some((v) => v.id === drug.id))
                  .map((drug) => (
                    <CommandItem
                      key={drug.id}
                      onSelect={() => {
                        setValue(drug.name);
                        setOpen(false);
                        onSelect(drug);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === drug.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{drug.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {drug.dosage.quantity} mg,{" "}
                          {drug.dosage.frequencyPerDay}x daily
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);
