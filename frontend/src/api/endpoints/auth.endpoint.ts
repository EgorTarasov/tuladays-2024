import { AuthDto } from "../models/auth.model";
import api from "../utils";

export namespace AuthEndpoint {
  export const token = async (username: string, password: string) =>
    api.post("/auth/token", { username, password }, { schema: AuthDto.Token });

  export const me = async () =>
    api.get("/users/me", {
      schema: AuthDto.User,
    });
}
