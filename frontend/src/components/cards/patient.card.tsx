import { PatientDto } from "@/api/models/patient.model";
import { observer } from "mobx-react-lite";
import { FC } from "react";

interface Props {
  item: PatientDto.Item;
}

export const PatientCard: FC<Props> = observer((x) => {
  return (
    <li className="flex flex-col">
      <small className="text-slate-500 font-medium"></small>
    </li>
  );
});
