import { makeAutoObservable, when } from "mobx";
import { z } from "zod";
import { AuthEndpoint } from "@/api/endpoints/auth.endpoint";
import { AuthDto } from "@/api/models/auth.model";
import { authToken } from "@/api/utils/auth-token";

export namespace Auth {
  export interface Authenticated {
    state: "authenticated";
    user: z.infer<typeof AuthDto.User>;
  }

  export interface Anonymous {
    state: "anonymous";
  }

  export interface Loading {
    state: "loading";
  }

  export type State = Authenticated | Anonymous | Loading;
}

class AuthServiceFactory {
  public auth: Auth.State = { state: "loading" };

  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  private async init() {
    if (!authToken.get()) {
      this.auth = { state: "anonymous" };
      return;
    }

    try {
      const user = await AuthEndpoint.me();
      this.auth = { state: "authenticated", user };
    } catch {
      this.auth = { state: "anonymous" };
    }
  }

  login = async (v: {
    username: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const token = await AuthEndpoint.token(v.username, v.password);
      authToken.set(token.access_token);

      const user = await AuthEndpoint.me();
      this.auth = { state: "authenticated", user };
      return true;
    } catch (e) {
      return false;
    }
  };

  waitInit() {
    return when(() => this.auth.state !== "loading");
  }

  logout() {
    this.auth = { state: "anonymous" };
    authToken.remove();
  }
}

export const AuthService = new AuthServiceFactory();
