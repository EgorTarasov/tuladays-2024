package repo

import (
	"context"
	"time"

	"github.com/EgorTarasov/tuladays/dashboard"
	"github.com/EgorTarasov/tuladays/dashboard/models"
	"github.com/EgorTarasov/tuladays/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type pg struct {
	*db.Queries
	pool *pgxpool.Pool
}

func NewPgRepo(pool *pgxpool.Pool) PatientRepo {
	return &pg{
		Queries: db.New(pool),
		pool:    pool,
	}
}

func (pg *pg) GetPatientById(ctx context.Context, id int64) (models.PatientData, error) {
	u, err := pg.Queries.GetPatientById(ctx, pgtype.Int8{Int64: id, Valid: true})
	var result models.PatientData
	if err != nil {
		return result, dashboard.ErrPatientNotFound
	}
	result.ID = u.FkUserID.Int64
	result.FirstName = u.FirstName
	result.LastName = u.LastName
	result.MiddleName = u.MiddleName
	result.Age = uint8(time.Now().Year() - u.Dob.Time.Year())
	result.Diagnosis = u.Diagnosis.String
	return result, nil
}

func (pg *pg) GetPatientsByDoctorID(ctx context.Context, doctorID int64, limit, offset int) ([]models.PatientData, error) {
	patients, err := pg.Queries.GetPatientsByDoctorID(ctx, db.GetPatientsByDoctorIDParams{
		DoctorID: pgtype.Int8{
			Int64: doctorID,
			Valid: true,
		},
		Limit:  int32(limit),
		Offset: int32(offset),
	})
	if err != nil {
		return nil, err
	}
	result := make([]models.PatientData, len(patients))
	for i, u := range patients {
		result[i].ID = u.FkUserID.Int64
		result[i].FirstName = u.FirstName
		result[i].LastName = u.LastName
		result[i].MiddleName = u.MiddleName
		result[i].Age = uint8(time.Now().Year() - u.Dob.Time.Year())
	}
	return result, nil
}
