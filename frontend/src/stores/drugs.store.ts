import { DrugEndpoint } from "@/api/endpoints/drug.endpoint";
import { DrugDto } from "@/api/models/drug.model";
import { autorun, makeAutoObservable } from "mobx";
import { AuthService } from "./auth.service";

export const DrugsStore = new (class {
  drugs: DrugDto.Item[] = [];

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      if (AuthService.auth.state === "anonymous") {
        this.drugs = [];
      } else if (AuthService.auth.state === "authenticated") {
        this.init();
      }
    });
  }

  async init() {
    const res = await DrugEndpoint.get();
    this.drugs = res;
  }
})();
