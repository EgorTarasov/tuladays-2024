package repo

import (
	"context"
	"strconv"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
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

func (pg *pg) CreateUser(ctx context.Context, email string, password models.Password) (int64, error) {
	u, err := pg.Queries.CreateUser(ctx, db.CreateUserParams{
		Email: email,
		PasswordHash: pgtype.Text{
			String: string(password),
			Valid:  true,
		},
	})
	if err != nil {
		return 0, err
	}
	return int64(u.ID), nil
}

func (pg *pg) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	u, err := pg.Queries.GetUserWithRoles(ctx, email)
	if err != nil {
		return nil, auth.ErrUserNotFound
	}
	return &models.User{
		ID:           int64(u.ID),
		Email:        u.Email,
		PasswordHash: models.Password(u.PasswordHash.String),
		CreatedAt:    u.CreatedAt.Time,
		UpdatedAt:    u.UpdatedAt.Time,
		Role:         u.Role.String,
	}, nil
}

func (pg *pg) UploadExternalUserData(ctx context.Context, payload models.ExternalData) error {
	var RiskOfDisease pgtype.Numeric

	strROD := strconv.FormatFloat(payload.RiskOfDisease, 'f', 2, 64)
	if err := RiskOfDisease.Scan(strROD); err != nil {
	}

	err := pg.Queries.UploadExternalUserData(ctx, db.UploadExternalUserDataParams{
		ExternalID: payload.ExternalID,
		FkUserID: pgtype.Int8{
			Int64: payload.UserID,
			Valid: true,
		},
		FirstName:  payload.FirstName,
		LastName:   payload.LastName,
		MiddleName: payload.MiddleName,
		Sex:        payload.Sex,
		Dob: pgtype.Date{
			Time: payload.Dob, Valid: true,
		},
		Email:         payload.Email,
		Address:       payload.Address,
		RiskOfDisease: RiskOfDisease,
		Diagnosis: pgtype.Text{
			String: payload.Diagnosis,
			Valid:  true,
		},
	})
	if err != nil {
		return auth.ErrUnableToAddExtUser
	}
	return nil
}
