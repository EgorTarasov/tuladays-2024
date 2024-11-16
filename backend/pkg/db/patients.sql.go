// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: patients.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const getPatientById = `-- name: GetPatientById :one
SELECT id, user_id, external_id, first_name, last_name, middle_name, sex, email, dob, address, risk_of_disease, diagnosis, fk_user_id, created_at, updated_at, deleted_at
from external_data
WHERE fk_user_id = $1
LIMIT 1
`

func (q *Queries) GetPatientById(ctx context.Context, fkUserID pgtype.Int8) (ExternalDatum, error) {
	row := q.db.QueryRow(ctx, getPatientById, fkUserID)
	var i ExternalDatum
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ExternalID,
		&i.FirstName,
		&i.LastName,
		&i.MiddleName,
		&i.Sex,
		&i.Email,
		&i.Dob,
		&i.Address,
		&i.RiskOfDisease,
		&i.Diagnosis,
		&i.FkUserID,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const getPatientsByDoctorID = `-- name: GetPatientsByDoctorID :many
SELECT ed.id, ed.user_id, ed.external_id, ed.first_name, ed.last_name, ed.middle_name, ed.sex, ed.email, ed.dob, ed.address, ed.risk_of_disease, ed.diagnosis, ed.fk_user_id, ed.created_at, ed.updated_at, ed.deleted_at
FROM external_data ed
    JOIN users u on ed.fk_user_id = u.id
    JOIN doctors_patients dp on u.id = dp.patient_id
WHERE dp.doctor_id = $1
LIMIT $2 OFFSET $3
`

type GetPatientsByDoctorIDParams struct {
	DoctorID pgtype.Int8
	Limit    int32
	Offset   int32
}

func (q *Queries) GetPatientsByDoctorID(ctx context.Context, arg GetPatientsByDoctorIDParams) ([]ExternalDatum, error) {
	rows, err := q.db.Query(ctx, getPatientsByDoctorID, arg.DoctorID, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ExternalDatum
	for rows.Next() {
		var i ExternalDatum
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ExternalID,
			&i.FirstName,
			&i.LastName,
			&i.MiddleName,
			&i.Sex,
			&i.Email,
			&i.Dob,
			&i.Address,
			&i.RiskOfDisease,
			&i.Diagnosis,
			&i.FkUserID,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DeletedAt,
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
