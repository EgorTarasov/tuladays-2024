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
SELECT id, user_id, external_id, first_name, last_name, middle_name, email, dob, address, risk_of_disease, diagnosis, fk_user_id, created_at, updated_at, deleted_at from external_data
WHERE user_id = $1 LIMIT 1
`

func (q *Queries) GetPatientById(ctx context.Context, userID pgtype.Int8) (ExternalDatum, error) {
	row := q.db.QueryRow(ctx, getPatientById, userID)
	var i ExternalDatum
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ExternalID,
		&i.FirstName,
		&i.LastName,
		&i.MiddleName,
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