import { Priority, PriorityLocaleMap } from "@/types/priority.type";
import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/utils/cn";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { AlertTriangleIcon } from "lucide-react";

export const PriorityCard: FC<{ data: Priority; text?: string }> = (x) => {
  const v = PriorityLocaleMap[x.data];

  const isImportant = x.data !== Priority.LOW;

  return (
    <div
      className={cn("flex items-center rounded-sm w-fit py-0.5 px-2 gap-2")}
      style={{
        backgroundColor: v.backgroundColor,
        color: v.color,
      }}
    >
      {isImportant && <AlertTriangleIcon className="size-4" />}
      {x.text && <span className="text-sm">{x.text}</span>}
    </div>
  );
};

export const PriorityIcon: FC<{
  data: Priority;
  alternate?: boolean;
  className?: string;
}> = (x) => {
  const v = PriorityLocaleMap[x.data];

  return (
    <Tooltip>
      <TooltipTrigger className={cn(x.alternate && "text-card", x.className)}>
        {x.alternate ? v.alternateIcon : v.icon}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>{v.locale} приоритет</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};
