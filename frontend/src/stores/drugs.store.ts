import { DrugEndpoint } from "@/api/endpoints/drug.endpoint";
import { DrugDto } from "@/api/models/drug.model";
import { makeAutoObservable } from "mobx";

export const DrugsStore = new (class {
  drugs: DrugDto.Item[] = [];

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  async init() {
    const res = await DrugEndpoint.get();
    this.drugs = res;
  }
})();
