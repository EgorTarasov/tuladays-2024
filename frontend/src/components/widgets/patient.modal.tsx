import { PatientDto } from "@/api/models/patient.model";
import { ModalFC } from "./modal/types";
import { observer } from "mobx-react-lite";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const PatientForm: ModalFC<{}, PatientDto.Item | null> = observer(
  (x) => {
    // const form = useForm({
    //   resolver: PatientDto.Create,
    // });
    return (
      <>
        <DialogHeader>
          <DialogTitle>Добавить кандидата</DialogTitle>
          <DialogDescription>Укажите данные кандидата</DialogDescription>
        </DialogHeader>
        <DialogContent></DialogContent>
      </>
    );
  },
);
