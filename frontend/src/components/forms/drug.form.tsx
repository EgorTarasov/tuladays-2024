import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ModalFC } from "../widgets/modal/types";
import { DrugDto } from "@/api/models/drug.model";
import { Label } from "../ui/label";

export const DrugForm: ModalFC<{}, DrugDto.Item> = (x) => {
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const res = await InstancesEndpoint.create(data).then(
    //   (v) => v.result.data[0],
    // );
    x.done({} as any);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Новое лекарство</DialogTitle>
        <DialogDescription>Укажите информацию о назначении</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-6">
        <Label>
          Название
          <Input name="name" />
        </Label>
        <Label>
          Название
          <Input name="name" />
        </Label>
        <DialogFooter>
          <Button type="submit">Создать</Button>
        </DialogFooter>
      </form>
    </>
  );
};
