import { DrugEndpoint } from "@/api/endpoints/drug.endpoint";
import { PatientEndpoint } from "@/api/endpoints/patient.endpoint";
import { DrugDto } from "@/api/models/drug.model";
import { DrugForm } from "@/components/forms/drug.form";
import { Button } from "@/components/ui/button";
import { Column, DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsChart } from "@/components/widgets/chart";
import { showModal } from "@/components/widgets/modal/show";
import { getTimeString, pluralize } from "@/utils/pluralize";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Mail, Trash2 } from "lucide-react";

const TitleValue = ({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) => (
  <div className="space-y-2">
    <span className="text-gray-900 font-medium">{title}:</span>
    <span className="text-gray-700 font-medium">{value}</span>
  </div>
);

const Page = () => {
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
      accessor: (x) => (
        <Button variant="ghost-destructive" size="sm">
          Отмена
        </Button>
      ),
    },
  ];

  return (
    <main className="p-10 flex flex-col h-full overflow-auto text-slate-800 w-full">
      <h1 className="font-medium text-2xl text-gray-600">О пациенте</h1>
      <h2 className="font-medium text-3xl text-gray-900 pt-3">
        {x.patient.last_name} {x.patient.first_name} {x.patient.middle_name}
      </h2>
      <div className="flex items-center">
        <TitleValue title="Возраст" value={x.patient.age} />
        {/* <KeyValue key="Дата поступления" value={x.patient.} /> */}
      </div>
      <h3 className="font-semibold text-xl text-gray-900 pt-5">Диагноз:</h3>
      <p className="pt-3">{x.patient.diagnosis}</p>
      <h3 className="font-semibold text-xl text-gray-900 pt-5">
        Последние измерения:
      </h3>
      <div className="grid grid-cols-[auto_auto] gap-x-24 gap-y-1 w-fit">
        <TitleValue
          title="Частота сердечных сокращений"
          value={x.patient.heart_data.heart_rate}
        />
        <TitleValue
          title="Насыщение кислородом"
          value={x.patient.percent_oxygen}
        />
        <TitleValue
          title="Кровяное давление"
          value={x.patient.heart_data.systolic}
        />
        <TitleValue title="Температура" value={x.patient.temperature} />
      </div>
      <div className="pt-5 flex gap-2">
        <Button>
          Написать сообщение
          <Mail />
        </Button>
        <Button variant="outline">Записать на приём</Button>
      </div>
      <Tabs defaultValue="changes">
        <TabsList className="mt-4">
          <TabsTrigger value="changes">Изменения показателей</TabsTrigger>
          <TabsTrigger value="drugs-assign">Назначение лекарств</TabsTrigger>
          <TabsTrigger value="drugs-consume">Приём лекарств</TabsTrigger>
          {/* <TabsTrigger value="recommendations">Рекомендации</TabsTrigger> */}
        </TabsList>
        <TabsContent
          value="changes"
          className="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-4"
        >
          {x.patient.graphs.map((v) => (
            <AnalyticsChart key={v.title} data={v} />
          ))}
        </TabsContent>
        <TabsContent value="drugs-assign">
          <DataTable columns={drugAssignColumns} data={x.drugs ?? []} />
          <Button
            onClick={() => showModal(DrugForm, { used: x.drugs ?? [] })}
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
