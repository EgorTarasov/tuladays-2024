import { PatientEndpoint } from "@/api/endpoints/patient.endpoint";
import { PatientDto } from "@/api/models/patient.model";
import { makeAutoObservable } from "mobx";

class patientStore {
  patients: PatientDto.Item[] = [];

  constructor() {
    makeAutoObservable(this);
    void this.init();
  }

  async init() {
    const [patients] = await Promise.all([PatientEndpoint.get()]);
    this.patients = patients;
  }
}

export const PatientStore = new patientStore();
