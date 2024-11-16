-- Create a new medicine item
-- name: CreateMedicineItem :one
INSERT INTO medicine_items (
        name,
        dosage,
        treatment_duration_days,
        schedule,
        remind_patient,
        disable_for_patient
    )
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
-- Get a medicine item by ID
-- name: GetMedicineItem :one
SELECT id,
    name,
    dosage,
    treatment_duration_days,
    schedule,
    remind_patient,
    disable_for_patient
FROM medicine_items
WHERE id = $1;
-- List all medicine items
-- name: ListMedicineItemsForPatient :many
SELECT mi.id,
    mi.name,
    mi.dosage,
    mi.treatment_duration_days,
    mi.schedule,
    mi.remind_patient,
    mi.disable_for_patient
FROM medicine_items mi
    join patients_medicine pm on mi.id = pm.medicine_id
WHERE pm.patient_id = $1;
-- name: ListMedicineItemsForDoctor :many
SELECT mi.id,
    mi.name,
    mi.dosage,
    mi.treatment_duration_days,
    mi.schedule,
    mi.remind_patient,
    mi.disable_for_patient
FROM medicine_items mi;
-- name: AssignMedicineItemToPatient :exec
INSERT INTO patients_medicine(patient_id, medicine_id, fk_doctor_id)
VALUES ($1, $2, $3);