package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
)

type PatientRepo interface {
	GetPatientById(ctx context.Context, id int64) (models.PatientData, error)
}

type HealthDataRepo interface {
	GetHeartRateData(ctx context.Context, id int64) (uint8, uint8, uint8, error)
}
