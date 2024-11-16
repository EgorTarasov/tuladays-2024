import { InstancesEndpoint } from "@/api/endpoints/instances.endpoint";
import { InstanceDto } from "@/api/models/instance.model";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ModalFC } from "../widgets/modal/types";

export const InstanceCreateForm: ModalFC<{}, InstanceDto.Item> = (x) => {
  const form = useForm<InstanceDto.Create>({
    resolver: zodResolver(InstanceDto.Create),
  });

  const submit = async (data: InstanceDto.Create) => {
    // const res = await InstancesEndpoint.create(data).then(
    //   (v) => v.result.data[0],
    // );
    x.done(res);
  };

  const jsonData = platform?.json_data;

  return (
    <Form {...form}>
      <DialogHeader>
        <DialogTitle>Create new instance</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        {jsonData &&
          Object.keys(jsonData).map((key) => (
            <Field
              key={key}
              control={form.control}
              component={(x) => <Input {...x} value={x.value ?? ""} />}
              name={`json_data.${key}`}
              label={key}
            />
          ))}
        <Field
          control={form.control}
          component={(x) => <Input {...x} />}
          name="name"
          label="Name"
        />
        <Field
          control={form.control}
          inline
          component={({ onChange, value, ...x }) => (
            <Switch checked={value} onCheckedChange={onChange} {...x} />
          )}
          name="link_flag"
          label="Input link"
        />
        <Field
          control={form.control}
          component={({ onChange, value, ...x }) => (
            <Switch checked={value} onCheckedChange={onChange} {...x} />
          )}
          inline
          hint="Allow to create Google Meet meetings"
          name="meets_flag"
          label="Meetings"
        />
        <DialogFooter>
          <Button
            type="submit"
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isDirty}
          >
            Create
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
