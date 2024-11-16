// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: medicine.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const assignMedicineItemToPatient = `-- name: AssignMedicineItemToPatient :exec
INSERT INTO patients_medicine(patient_id, medicine_id, fk_doctor_id)
VALUES ($1, $2, $3)
`

type AssignMedicineItemToPatientParams struct {
	PatientID  pgtype.Int8
	MedicineID pgtype.Int8
	FkDoctorID pgtype.Int8
}

func (q *Queries) AssignMedicineItemToPatient(ctx context.Context, arg AssignMedicineItemToPatientParams) error {
	_, err := q.db.Exec(ctx, assignMedicineItemToPatient, arg.PatientID, arg.MedicineID, arg.FkDoctorID)
	return err
}

const createMedicineItem = `-- name: CreateMedicineItem :one
INSERT INTO medicine_items (
        name,
        dosage,
        treatment_duration_days,
        schedule,
        remind_patient,
        disable_for_patient
    )
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, name, dosage, treatment_duration_days, schedule, remind_patient, disable_for_patient, created_at, updated_at
`

type CreateMedicineItemParams struct {
	Name                  string
	Dosage                []byte
	TreatmentDurationDays int32
	Schedule              []string
	RemindPatient         bool
	DisableForPatient     bool
}

// Create a new medicine item
func (q *Queries) CreateMedicineItem(ctx context.Context, arg CreateMedicineItemParams) (MedicineItem, error) {
	row := q.db.QueryRow(ctx, createMedicineItem,
		arg.Name,
		arg.Dosage,
		arg.TreatmentDurationDays,
		arg.Schedule,
		arg.RemindPatient,
		arg.DisableForPatient,
	)
	var i MedicineItem
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Dosage,
		&i.TreatmentDurationDays,
		&i.Schedule,
		&i.RemindPatient,
		&i.DisableForPatient,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getMedicineItem = `-- name: GetMedicineItem :one
SELECT id,
    name,
    dosage,
    treatment_duration_days,
    schedule,
    remind_patient,
    disable_for_patient
FROM medicine_items
WHERE id = $1
`

type GetMedicineItemRow struct {
	ID                    int64
	Name                  string
	Dosage                []byte
	TreatmentDurationDays int32
	Schedule              []string
	RemindPatient         bool
	DisableForPatient     bool
}

// Get a medicine item by ID
func (q *Queries) GetMedicineItem(ctx context.Context, id int64) (GetMedicineItemRow, error) {
	row := q.db.QueryRow(ctx, getMedicineItem, id)
	var i GetMedicineItemRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Dosage,
		&i.TreatmentDurationDays,
		&i.Schedule,
		&i.RemindPatient,
		&i.DisableForPatient,
	)
	return i, err
}

const listMedicineItemsForDoctor = `-- name: ListMedicineItemsForDoctor :many
SELECT mi.id,
    mi.name,
    mi.dosage,
    mi.treatment_duration_days,
    mi.schedule,
    mi.remind_patient,
    mi.disable_for_patient
FROM medicine_items mi
`

type ListMedicineItemsForDoctorRow struct {
	ID                    int64
	Name                  string
	Dosage                []byte
	TreatmentDurationDays int32
	Schedule              []string
	RemindPatient         bool
	DisableForPatient     bool
}

func (q *Queries) ListMedicineItemsForDoctor(ctx context.Context) ([]ListMedicineItemsForDoctorRow, error) {
	rows, err := q.db.Query(ctx, listMedicineItemsForDoctor)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ListMedicineItemsForDoctorRow
	for rows.Next() {
		var i ListMedicineItemsForDoctorRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Dosage,
			&i.TreatmentDurationDays,
			&i.Schedule,
			&i.RemindPatient,
			&i.DisableForPatient,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listMedicineItemsForPatient = `-- name: ListMedicineItemsForPatient :many
SELECT mi.id,
    mi.name,
    mi.dosage,
    mi.treatment_duration_days,
    mi.schedule,
    mi.remind_patient,
    mi.disable_for_patient
FROM medicine_items mi
    join patients_medicine pm on mi.id = pm.medicine_id
WHERE pm.patient_id = $1
`

type ListMedicineItemsForPatientRow struct {
	ID                    int64
	Name                  string
	Dosage                []byte
	TreatmentDurationDays int32
	Schedule              []string
	RemindPatient         bool
	DisableForPatient     bool
}

// List all medicine items
func (q *Queries) ListMedicineItemsForPatient(ctx context.Context, patientID pgtype.Int8) ([]ListMedicineItemsForPatientRow, error) {
	rows, err := q.db.Query(ctx, listMedicineItemsForPatient, patientID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ListMedicineItemsForPatientRow
	for rows.Next() {
		var i ListMedicineItemsForPatientRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Dosage,
			&i.TreatmentDurationDays,
			&i.Schedule,
			&i.RemindPatient,
			&i.DisableForPatient,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}