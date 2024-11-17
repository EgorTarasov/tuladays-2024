import { z } from "zod";
import { AuthDto } from "../models/auth.model";
import api from "../utils";

export namespace AuthEndpoint {
  export const current = () => api.get("/auth/me");

  export type LoginTemplate = {
    email: string;
    password: string;
  };
  export const login = async (v: LoginTemplate) =>
    api.post("/auth/login", v, {
      schema: AuthDto.Token,
    });

  export type RegisterTemplate = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };

  export const register = async (v: RegisterTemplate) =>
    api.post("/auth/signup", v, {
      schema: AuthDto.Token,
    });
}
