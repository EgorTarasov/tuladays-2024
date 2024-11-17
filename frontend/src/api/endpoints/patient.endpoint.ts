import { PatientDto } from "../models/patient.model";
import api from "../utils";

export namespace PatientEndpoint {
  export const get = () =>
    api.get("/dashboard/patients", {
      schema: PatientDto.Item.array(),
    });

  export const getById = (id: number) =>
    api.get(`/dashboard/patient/${id}`, {
      schema: PatientDto.Item,
    });
}
