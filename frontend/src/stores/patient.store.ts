import { PatientEndpoint } from "@/api/endpoints/patient.endpoint";
import { PatientDto } from "@/api/models/patient.model";
import { autorun, makeAutoObservable } from "mobx";
import { AuthService } from "./auth.service";

class patientStore {
  patients: PatientDto.Item[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
    autorun(() => {
      if (AuthService.auth.state === "anonymous") {
        this.patients = [];
      } else if (AuthService.auth.state === "authenticated") {
        this.init();
      }
    });
  }

  async init() {
    this.loading = true;
    const [patients] = await Promise.all([PatientEndpoint.get()]);
    this.patients = patients;
    this.loading = false;
  }
}

export const PatientStore = new patientStore();
