package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
)

func (a *service) CreateEmailAccount(ctx context.Context, payload models.CreateUser) (models.AuthToken, error) {
	password, err := models.NewHashedPassword(payload.Password)
	if err != nil {
		return "", err // TODO: define error
	}

	newID, err := a.users.CreateUser(ctx, payload.Email, password)
	if err != nil {
		return "", err // TODO: define error
	}

	token, err := models.NewAuthToken(models.UserData{
		UserID: newID,
		Role:   "user",
	}, a.tokenSecret)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (a *service) AuthWithEmail(ctx context.Context, payload models.LoginData) (models.AuthToken, error) {
	user, err := a.users.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		return "", auth.ErrInvalidCredentials
	}

	if err := user.PasswordHash.ComparePassword(payload.Password); err != nil {
		return "", auth.ErrInvalidCredentials
	}
	token, err := models.NewAuthToken(models.UserData{
		UserID: user.ID,
		Role:   user.Role,
	}, a.tokenSecret)
	if err != nil {
		return "", auth.ErrInvalidCredentials
	}

	return token, nil
}
