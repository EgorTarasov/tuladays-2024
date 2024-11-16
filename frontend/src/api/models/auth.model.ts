import { z } from "zod";

export namespace AuthDto {
  export const Token = z.object({
    access_token: z.string(),
  });
}
