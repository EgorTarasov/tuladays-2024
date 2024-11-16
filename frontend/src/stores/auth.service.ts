import { AuthEndpoint } from "@/api/endpoints/auth.endpoint";
import { authToken } from "@/api/utils/auth-token";
import { Auth } from "@/types/auth.type";
import { makeAutoObservable, when } from "mobx";

class AuthServiceViewModel {
  public auth: Auth.State = { state: "loading" };

  constructor() {
    makeAutoObservable(this);
    void this.init();
    // this.auth = {
    //   state: "authenticated",
    //   user: {
    //     id: 1
    //   }
    // };
  }

  private async init() {
    if (!authToken.get()) {
      this.auth = { state: "anonymous" };
      return;
    }

    try {
      const user = await AuthEndpoint.current();
      this.auth = { state: "authenticated", user };
    } catch {
      this.auth = { state: "anonymous" };
    }
  }

  login = async (v: AuthEndpoint.LoginTemplate): Promise<boolean> => {
    try {
      const token = await AuthEndpoint.login(v);
      authToken.set(token.access_token);

      const user = await AuthEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  async waitInit() {
    await when(() => this.auth.state !== "loading");
  }

  register = async (v: AuthEndpoint.RegisterTemplate): Promise<boolean> => {
    try {
      const token = await AuthEndpoint.register(v);
      authToken.set(token.access_token);

      const user = await AuthEndpoint.current();
      this.auth = { state: "authenticated", user };
      return true;
    } catch {
      return false;
    }
  };

  logout() {
    this.auth = { state: "anonymous" };
    authToken.remove();
  }
}

export const AuthService = new AuthServiceViewModel();
