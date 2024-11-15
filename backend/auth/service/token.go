package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
)

func (a *service) AuthWithToken(ctx context.Context, authToken string) error {
	token := models.AuthToken(authToken)
	if err := token.Validate(a.tokenSecret); err != nil {
		return auth.ErrInvalidCredentials
	}
	return nil
}
