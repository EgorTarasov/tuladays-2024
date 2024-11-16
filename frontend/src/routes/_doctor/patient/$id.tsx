import { PatientEndpoint } from "@/api/endpoints/patient.endpoint";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Mail } from "lucide-react";

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
      <div className="grid grid-cols-2 gap-x-24 gap-y-1">
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
      <div className="pt-5">
        <Button>
          Написать сообщение
          <Mail />
        </Button>
        <Button variant="outline">Записать на приём</Button>
      </div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="changes">Изменения показателей</TabsTrigger>
          <TabsTrigger value="drugs-assign">Назначение лекарств</TabsTrigger>
          <TabsTrigger value="drugs-consume">Приём лекарств</TabsTrigger>
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
        </TabsList>
        <TabsContent value="changes"></TabsContent>
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
      const [patient] = await Promise.all([
        PatientEndpoint.getById(Number(x.params.id)),
      ]);

      return { patient };
    } catch (error) {
      throw redirect({ to: "/" });
    }
  },
});
