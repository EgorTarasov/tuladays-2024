import { CircleHelpIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { buttonVariants } from "./button";
import { cn } from "@/utils/cn";
import { TooltipContentProps } from "@radix-ui/react-tooltip";

export const Hint = ({
  children,
  side,
  big = false,
}: {
  children: React.ReactNode;
  side?: TooltipContentProps["side"];
  big?: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          type="button"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "text-muted-foreground",
            !big && "min-w-6 size-6 rounded-full [&_svg]:size-4",
          )}
        >
          <CircleHelpIcon />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm" side={side}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
