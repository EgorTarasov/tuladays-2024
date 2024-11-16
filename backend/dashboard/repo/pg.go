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

func NewPgRepo(pool *pgxpool.Pool) UserRepo {
	return &pg{
		Queries: db.New(pool),
		pool:    pool,
	}
}

func (pg *pg) GetPatientById(ctx context.Context, id int64) (models.UserData, error) {
	u, err := pg.Queries.GetPatientById(ctx, pgtype.Int8{Int64: id, Valid: true})
	var result models.UserData
	if err != nil {
		return result, dashboard.ErrPatientNotFound
	}
	result.ID = int64(u.ID)
	result.FirstName = u.FirstName
	result.LastName = u.LastName
	result.MiddleName = u.MiddleName
	result.Age = uint8(time.Now().Year() - u.Dob.Time.Year())
	return result, nil
}
