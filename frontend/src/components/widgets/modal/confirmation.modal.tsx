import { observer } from "mobx-react-lite";
import { Button } from "../../ui/button";
import { useAction } from "@/utils/hooks/use-action";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ReactNode } from "react";
import { ModalFC } from "./types";

export const ConfirmationModal: ModalFC<
  {
    title: string;
    description?: string | ReactNode;
    destructive?: boolean;
    buttonText?: string;
  },
  boolean
> = observer((x) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{x.title}</DialogTitle>
        {x.description && (
          <DialogDescription>{x.description}</DialogDescription>
        )}
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => x.done(false)}>
          Cancel
        </Button>
        <Button
          variant={x.destructive ? "destructive" : "default"}
          onClick={() => x.done(true)}
        >
          {x.buttonText ?? "Ok"}
        </Button>
      </DialogFooter>
    </>
  );
});
