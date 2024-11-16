package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
)

type UserRepo interface {
	GetPatientById(ctx context.Context, id int64) (models.UserData, error)
}

type HealthData interface {
	GetHeartRateData(ctx context.Context, id int64) (int, int, int, error)
}
