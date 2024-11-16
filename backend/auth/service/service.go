package service

import (
	"context"
	"io"

	"github.com/EgorTarasov/tuladays/auth/models"
	"github.com/EgorTarasov/tuladays/auth/repo"
)

type Service interface {
	CreateEmailAccount(ctx context.Context, payload models.CreateUser) (models.AuthToken, error)
	AuthWithEmail(ctx context.Context, payload models.LoginData) (models.AuthToken, error)
	AuthWithToken(ctx context.Context, authToken string) error
	ProcessCSV(ctx context.Context, DataCSV io.Reader, doctorID int64) error
}

type service struct {
	users       repo.UserRepo
	tokenSecret string
}

func New(users repo.UserRepo, secret string) Service {
	return &service{
		users:       users,
		tokenSecret: secret,
	}
}
