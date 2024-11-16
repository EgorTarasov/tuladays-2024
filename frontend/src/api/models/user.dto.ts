import { z } from "zod";

export namespace UserDto {
  export const Item = z.object({
    id: z.number(),
    role: z.enum(["doctor", "patient"]),
  });
  export type Item = z.infer<typeof Item>;
}
