package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
	"github.com/EgorTarasov/tuladays/dashboard/repo"
	"github.com/rs/zerolog/log"
)

type service struct {
	health   repo.HealthDataRepo
	patients repo.PatientRepo
	medicine repo.MedicineRepo
}

type Service interface {
	GetDashboardForUser(ctx context.Context, id int64) (models.PatientData, error)
	GetPatients(context.Context, int64, int, int) ([]models.PatientData, error)

	CreateMedicineRecord(ctx context.Context, payload models.MedicineCreate) (int64, error)
	GetMedicineRecord(ctx context.Context, id int64) (models.MedicineItem, error)
	ListAllRecords(ctx context.Context) ([]models.MedicineItem, error)
	ListForPatient(ctx context.Context, patientID int64) ([]models.MedicineItem, error)
	AssignMedicine(ctx context.Context, doctorId, patientID, medicineID int64) error
}

func New(healthRepo repo.HealthDataRepo, patients repo.PatientRepo, medicine repo.MedicineRepo) Service {
	return &service{
		health:   healthRepo,
		patients: patients,
		medicine: medicine,
	}
}

// GetDashboardForUser returns the dashboard data for the user with the given ID.
func (s *service) GetDashboardForUser(ctx context.Context, id int64) (models.PatientData, error) {
	patientData, err := s.patients.GetPatientById(ctx, id)
	if err != nil {
		return patientData, err
	}

	bpm, sys, dia, err := s.health.GetHeartRateData(ctx, id)
	if err != nil {
		return patientData, err
	}

	patientData.HeartData = models.HeartData{
		HeartRate: bpm,
		Systolic:  sys,
		Diastolic: dia,
	}
	graphs, err := s.health.GetHeartRateGraph(ctx, id)
	if err != nil {
		log.Err(err).Msg("failed to get heart rate graph")
		return patientData, err
	}
	patientData.Graphs = graphs
	return patientData, nil
}

func (s *service) GetPatients(ctx context.Context, doctorID int64, limit, offset int) ([]models.PatientData, error) {
	patients, err := s.patients.GetPatientsByDoctorID(ctx, doctorID, limit, offset)
	if err != nil {
		return nil, err
	}

	for i := range patients {
		p := &patients[i] // Get a pointer to the current patient

		bpm, sys, dia, err := s.health.GetHeartRateData(ctx, p.ID)
		if err != nil {
			log.Err(err).Msg("failed to get heart rate data")
		} else {
			p.HeartData = models.HeartData{
				HeartRate: bpm,
				Systolic:  sys,
				Diastolic: dia,
			}
		}

		graphs, err := s.health.GetHeartRateGraph(ctx, p.ID)
		if err != nil {
			log.Err(err).Msg("failed to get heart rate graph")
			continue
		}
		p.Graphs = graphs
	}
	return patients, nil
}

func (s *service) SendNotification(ctx context.Context, id int64) error {
	return nil
}

func (s *service) CreateMedicineRecord(ctx context.Context, payload models.MedicineCreate) (int64, error) {
	return s.medicine.CreateMedicineRecord(ctx, payload)
}

func (s *service) GetMedicineRecord(ctx context.Context, id int64) (models.MedicineItem, error) {
	return s.medicine.GetMedicineRecord(ctx, id)
}

func (s *service) ListAllRecords(ctx context.Context) ([]models.MedicineItem, error) {
	return s.medicine.ListAllRecords(ctx)
}

func (s *service) ListForPatient(ctx context.Context, patientID int64) ([]models.MedicineItem, error) {
	return s.medicine.ListForPatient(ctx, patientID)
}

func (s *service) AssignMedicine(ctx context.Context, doctorId, patientID, medicineID int64) error {
	return s.medicine.AssignMedicine(ctx, doctorId, patientID, medicineID)
}
