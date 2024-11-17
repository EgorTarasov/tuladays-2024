import { DrugEndpoint } from "@/api/endpoints/drug.endpoint";
import { PatientEndpoint } from "@/api/endpoints/patient.endpoint";
import { DrugDto } from "@/api/models/drug.model";
import api from "@/api/utils";
import { authToken } from "@/api/utils/auth-token";
import { PriorityCard } from "@/components/cards/priority-icon";
import { DrugForm } from "@/components/forms/drug.form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Column, DataTable } from "@/components/ui/data-table";
import { Field, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsChart } from "@/components/widgets/chart";
import { ConfirmationModal } from "@/components/widgets/modal/confirmation.modal";
import { showModal } from "@/components/widgets/modal/show";
import { AuthService } from "@/stores/auth.service";
import { useInvalidate } from "@/utils/hooks/use-invalidate";
import { getTimeString, pluralize } from "@/utils/pluralize";
import { zz } from "@/utils/zod/zz";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const TitleValue = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit: string;
}) => (
  <div className="flex flex-col lg:flex-row gap-x-2">
    <span className="text-gray-900 font-medium">{title}:</span>
    <span className="text-gray-700 font-medium">
      {value} {unit}
    </span>
  </div>
);

const schema = zz.object({
  message: zz.string().trim().min(1),
});

const Page = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const invalidate = useInvalidate({
    fullPath: "/patient/$id",
    params: { id: Route.useParams().id },
  });
  const x = Route.useLoaderData();

  const drugAssignColumns: Column<DrugDto.Item>[] = [
    {
      header: "Лекарство",
      accessor: (x) => x.name,
    },
    {
      header: "Дозировка",
      accessor: (x) =>
        `${x.dosage.quantity} мг, ${x.dosage.frequencyPerDay} ${pluralize(
          x.dosage.frequencyPerDay,
          ["раз", "раза", "раз"],
        )} в день`,
    },
    {
      header: "Курс лечения",
      accessor: (x) => `${getTimeString(x.treatmentDurationDays)}`,
    },
    {
      header: <Trash2 />,
      accessor: (v) => (
        <Button
          variant="ghost-destructive"
          size="sm"
          onClick={async () => {
            const ok = await showModal(ConfirmationModal, {
              title: "Отменить лекарство",
              description: "Вы уверены, что хотите отменить лекарство?",
            });

            if (ok) {
              await DrugEndpoint.detach({
                patient_id: x.patient.id,
                medicine_id: v.id,
              });
              invalidate();
            }
          }}
        >
          Отмена
        </Button>
      ),
    },
  ];

  return (
    <main className="px-6 py-10 md:p-10 flex flex-col h-full overflow-auto text-slate-800 w-full">
      <h1 className="font-medium text-2xl text-gray-600">О пациенте</h1>
      <div className="flex flex-col xl:flex-row justify-between xl:items-center pt-3">
        <h2 className="font-medium text-3xl text-gray-900">
          {x.patient.last_name} {x.patient.first_name} {x.patient.middle_name}
        </h2>
        <PriorityCard data={x.patient.risk_of_disease} text={x.patient.alert} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[auto_auto] gap-x-24 gap-y-1 w-fit pt-4">
        <TitleValue title="Возраст" value={x.patient.age} unit="лет" />
        <TitleValue title="Адрес" value={x.patient.address} unit="" />
        <TitleValue
          title="Дата поступления"
          value={new Date(x.patient.created_at).toLocaleDateString()}
          unit=""
        />
        <TitleValue
          title="Дата последнего приё"
          value={new Date(x.patient.last_visit).toLocaleDateString()}
          unit=""
        />
      </div>
      <h3 className="font-semibold text-xl text-gray-900 pt-5">Диагноз:</h3>
      <p>{x.patient.diagnosis}</p>
      <h3 className="font-semibold text-xl text-gray-900 pt-5">
        Последние измерения:
      </h3>
      <div className="grid grid-cols-1 xl:grid-cols-[auto_auto] gap-x-24 gap-y-1 w-fit">
        <TitleValue
          title="Частота сердечных сокращений"
          value={x.patient.heart_data.heart_rate}
          unit="уд/мин"
        />
        <TitleValue
          title="Насыщение кислородом"
          value={x.patient.percent_oxygen}
          unit="%"
        />
        <TitleValue
          title="Кровяное давление"
          value={x.patient.heart_data.systolic}
          unit="мм рт. ст."
        />
        <TitleValue
          title="Температура"
          value={x.patient.temperature}
          unit="°C"
        />
      </div>
      <div className="pt-5 flex gap-2">
        <Popover open={popupOpen} onOpenChange={setPopupOpen}>
          <PopoverTrigger asChild>
            <button className={buttonVariants()}>
              Написать сообщение
              <Mail />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <Form {...form}>
              <form
                className="flex flex-col gap-y-2"
                onSubmit={form.handleSubmit((v) =>
                  toast.promise(
                    fetch("https://bot.larek.tech/notification", {
                      method: "POST",
                      body: JSON.stringify({
                        id: x.patient.id,
                        text: v.message,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${authToken.get()}`,
                      },
                    }),
                    {
                      success: "Сообщение отправлено",
                      error: "Не удалось отправить сообщение",
                      finally: () => {
                        form.reset();
                        setPopupOpen(false);
                      },
                    },
                  ),
                )}
              >
                <Field
                  control={form.control}
                  component={(x) => <Input {...x} />}
                  name="message"
                  label="Сообщение"
                />
                <Button type="submit" size="sm" className="ml-auto">
                  Отправить
                </Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>
        <Button variant="outline">Записать на приём</Button>
      </div>
      <Tabs defaultValue="changes">
        <TabsList className="mt-4">
          <TabsTrigger value="changes">Изменения показателей</TabsTrigger>
          <TabsTrigger value="drugs-assign">Назначение лекарств</TabsTrigger>
          {/* <TabsTrigger value="drugs-consume">Приём лекарств</TabsTrigger> */}
          {/* <TabsTrigger value="recommendations">Рекомендации</TabsTrigger> */}
        </TabsList>
        <TabsContent
          value="changes"
          className="grid grid-cols-1 xl:grid-cols-2 gap-4"
        >
          {x.patient.graphs.map((v) => (
            <AnalyticsChart key={v.title} data={v} />
          ))}
        </TabsContent>
        <TabsContent value="drugs-assign">
          <DataTable columns={drugAssignColumns} data={x.drugs ?? []} />
          <Button
            onClick={() =>
              showModal(DrugForm, { used: x.drugs ?? [] }).then(
                async (data) => {
                  if (!data?.id) return;

                  await DrugEndpoint.attach({
                    medicine_id: data.id,
                    patient_id: x.patient.id,
                    doctor_id:
                      AuthService.auth.state === "authenticated"
                        ? AuthService.auth.user.user_id
                        : 0,
                  });
                  invalidate();
                },
              )
            }
            className="mt-2"
          >
            Добавить лекарство
          </Button>
        </TabsContent>
        <TabsContent value="drugs-consume"></TabsContent>
        {/* <TabsContent value="recommendations">
          <div className="rounded-xl bg-card p-4">
            {x.patient.r}
          </div>
        </TabsContent> */}
      </Tabs>
    </main>
  );
};

export const Route = createFileRoute("/_doctor/patient/$id")({
  component: Page,
  loader: async (x) => {
    if (isNaN(Number(x.params.id))) {
      throw redirect({ to: "/" });
    }

    try {
      const [patient, drugs] = await Promise.all([
        PatientEndpoint.getById(Number(x.params.id)),
        DrugEndpoint.getByPatient(Number(x.params.id)),
      ]);

      return { patient, drugs };
    } catch (error) {
      throw redirect({ to: "/" });
    }
  },
});
