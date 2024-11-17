import { PatientDto } from "@/api/models/patient.model";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { PriorityCard, PriorityIcon } from "./priority-icon";
import { Priority } from "@/types/priority.type";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@/utils/cn";
import { Button, buttonVariants } from "../ui/button";

interface Props {
  item: PatientDto.Item;
}

export const PatientCard: FC<Props> = observer((x) => {
  const { id: currentId } = useParams({ strict: false });

  return (
    <li
      className={cn(
        "flex flex-col relative hover:bg-slate-50 py-3 px-5",
        currentId === x.item.id.toString() && "bg-slate-50",
      )}
    >
      <div className="flex justify-between">
        <div>
          <small className="text-slate-500 font-medium block">
            {x.item.first_name}
          </small>
          <Link
            className="text-lg font-medium before:absolute before:inset-0"
            to="/patient/$id"
            params={{ id: x.item.id.toString() }}
          >
            {x.item.last_name} {x.item.first_name} {x.item.middle_name}
          </Link>
        </div>
        <PriorityIcon data={x.item.risk_of_disease} />
      </div>
      <PriorityCard data={x.item.risk_of_disease} text={x.item.alert} />
      <p className="text-slate-800 text-sm">{x.item.diagnosis}</p>
      <a
        href={x.item.telegram_link}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Написать сообщение
      </a>
    </li>
  );
});
