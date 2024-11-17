import { z } from "zod";

export namespace DrugDto {
  export const LinkCreate = z.object({
    link: z.string().url(),
  });

  export const Create = z.object({
    name: z.string(), // Название
    dosage: z.object({
      quantity: z.number().int().min(1),
      frequencyPerDay: z.number().int().min(1),
    }),
    treatmentDurationDays: z.number().int().min(1), // длительность курса лечения
  });
  export type Create = z.infer<typeof Create>;

  export const Item = z.object({
    id: z.number(),
    name: z.string(),
    dosage: z.object({
      quantity: z.number().int().min(1),
      frequencyPerDay: z.number().int().min(1),
    }),
    treatmentDurationDays: z.number().int().min(1), // длительность курса лечения
    schedule: z.array(z.string().regex(/^\d{2}:\d{2}$/)), // календарь приема лекарства (HH:MM)[]
    remindPatient: z.boolean(), // напоминать пациенту
    disableForPatient: z.boolean(), // отключить у пациента
  });
  export type Item = z.infer<typeof Item>;
}

const medicineCreate = {
  name: "Paracetamol",
  dosage: {
    quantity: 500, // го в мг
    frequencyPerDay: 3,
  },
  treatmentDurationDays: 7,
  actions: {
    addFromLink: "https://example.com/",
  },
};

const medicineItem = {
  id: "12345",
  name: "Paracetamol",
  dosage: {
    quantity: 500,
    frequencyPerDay: 3,
  },
  treatmentDurationDays: 7,
  schedule: ["08:00", "14:00", "20:00"],
  remindPatient: true,
  disableForPatient: false,
};
