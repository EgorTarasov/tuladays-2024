import { DrugForm } from "@/components/forms/drug.form";
import { showModal } from "@/components/widgets/modal/show";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_doctor/")({
  component: () => (
    <div>
      <button onClick={() => showModal(DrugForm, {})}>show modal</button>
    </div>
  ),
});
