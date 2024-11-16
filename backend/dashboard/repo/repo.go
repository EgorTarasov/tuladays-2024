package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
)

type PatientRepo interface {
	GetPatientById(ctx context.Context, id int64) (models.PatientData, error)
	// GetPatients(ctx context.Context, doctorID int64) ([]int64, error)
}

type HealthDataRepo interface {
	GetHeartRateData(ctx context.Context, id int64) (uint8, uint8, uint8, error)
}
