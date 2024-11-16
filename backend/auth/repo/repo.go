package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
)

type UserRepo interface {
	CreateUser(ctx context.Context, email string, password models.Password, roles ...auth.UserRole) (int64, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	UploadExternalUserData(ctx context.Context, payload models.ExternalData) error
	AssignUserToDoctor(ctx context.Context, patientID, doctorID int64) error
}
