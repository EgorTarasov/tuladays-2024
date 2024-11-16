package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/dashboard/models"
	"github.com/EgorTarasov/tuladays/dashboard/repo"
)

type service struct {
	health   repo.HealthDataRepo
	patients repo.PatientRepo
}

type Service interface {
	GetDashboardForUser(ctx context.Context, id int64) (models.PatientData, error)
	GetPatients(context.Context, int64) ([]models.PatientData, error)
}

func New(healthRepo repo.HealthDataRepo, patients repo.PatientRepo) Service {
	return &service{
		health:   healthRepo,
		patients: patients,
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

	return patientData, nil
}

func (s *service) GetPatients(ctx context.Context, doctorID int64) ([]models.PatientData, error) {
	return nil, nil
}

func (s *service) SendNotification(ctx context.Context, id int64) error {
	return nil
}
