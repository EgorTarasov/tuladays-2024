package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
)

type PatientRepo interface {
	GetPatientById(ctx context.Context, id int64) (models.PatientData, error)
	GetPatientsByDoctorID(ctx context.Context, doctorID int64, limit, offset int) ([]models.PatientData, error)
}

type HealthDataRepo interface {
	GetHeartRateData(ctx context.Context, id int64) (uint8, uint8, uint8, error)
	GetHeartRateGraph(ctx context.Context, patientID int64) ([]models.Graph, error)
	GetOxygenData(ctx context.Context, patientID int64) (uint8, error)
	GetSugarData(ctx context.Context, patientID int64) (float32, error)
}

type MedicineRepo interface {
	CreateMedicineRecord(ctx context.Context, payload models.MedicineCreate) (int64, error)
	GetMedicineRecord(ctx context.Context, id int64) (models.MedicineItem, error)
	ListAllRecords(ctx context.Context) ([]models.MedicineItem, error)
	ListForPatient(ctx context.Context, patientID int64) ([]models.MedicineItem, error)
	AssignMedicine(ctx context.Context, doctorId, patientID, medicineID int64) error
}
