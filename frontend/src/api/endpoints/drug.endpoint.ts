import { z } from "zod";
import { DrugDto } from "../models/drug.model";
import api from "../utils";

export namespace DrugEndpoint {
  export const get = () =>
    api.get("/medicine", {
      schema: DrugDto.Item.array(),
    });

  export const getByPatient = (id: number) =>
    api.get(`/medicine/patient/${id}`, {
      schema: DrugDto.Item.array().nullable(),
    });

  export const attach = (data: {
    doctor_id: number;
    patient_id: number;
    medicine_id: number;
  }) => api.post("/medicine/assign", data);

  export const detach = (data: { patient_id: number; medicine_id: number }) =>
    api.delete(`/medicine/delete/${data.patient_id}/${data.medicine_id}`);

  export const getById = (id: number) =>
    api.get(`/medicine/${id}`, {
      schema: DrugDto.Item,
    });

  export const create = (data: DrugDto.Create) =>
    api.post("/medicine/create", data, {
      schema: z.object({
        id: z.number(),
      }),
    });
}
