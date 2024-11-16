import { Priority, PriorityLocaleMap } from "@/types/priority.type";
import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/utils/cn";
import { TooltipPortal } from "@radix-ui/react-tooltip";

export const PriorityCard: FC<{ data: Priority }> = (x) => {
  const v = PriorityLocaleMap[x.data];

  return (
    <div className="flex gap-1 items-center">
      {v.icon}
      <span className="text-sm" style={{ color: v.color }}>
        {v.alternateLocale} важность
      </span>
    </div>
  );
};

export const PriorityIcon: FC<{ data: Priority; alternate?: boolean }> = (
  x,
) => {
  const v = PriorityLocaleMap[x.data];

  return (
    <Tooltip>
      <TooltipTrigger className={cn(x.alternate && "text-card")}>
        {x.alternate ? v.alternateIcon : v.icon}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{v.locale} приоритет</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
