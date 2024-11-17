import { Priority, PriorityLocaleMap } from "@/types/priority.type";
import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/utils/cn";
import { TooltipPortal } from "@radix-ui/react-tooltip";
import { AlertTriangleIcon } from "lucide-react";

export const PriorityCard: FC<{ data: number; text?: string }> = (x) => {
  const priority = (() => {
    if (x.data >= 0.8) return Priority.HIGH;
    if (x.data >= 0.5) return Priority.MEDIUM;
    return Priority.LOW;
  })();
  const v = PriorityLocaleMap[priority];

  const isImportant = priority !== Priority.LOW;

  return (
    <div
      className={cn(
        "flex items-center rounded-sm w-fit py-0.5 px-2 gap-2 w-fit h-fit",
      )}
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
  data: number;
  alternate?: boolean;
  className?: string;
}> = (x) => {
  const priority = (() => {
    if (x.data >= 0.8) return Priority.HIGH;
    if (x.data >= 0.5) return Priority.MEDIUM;
    return Priority.LOW;
  })();
  const v = PriorityLocaleMap[priority];

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
