package repo

import (
	"context"
	"encoding/json"

	"github.com/EgorTarasov/tuladays/dashboard/models"
	"github.com/EgorTarasov/tuladays/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type pgMedicine struct {
	*db.Queries
	pool *pgxpool.Pool
}

func NewMedicine(pool *pgxpool.Pool) MedicineRepo {
	return &pgMedicine{
		Queries: db.New(pool),
		pool:    pool,
	}
}

func (pg *pgMedicine) CreateMedicineRecord(ctx context.Context, payload models.MedicineCreate) (int64, error) {
	encoded, err := json.Marshal(payload.Dosage)
	if err != nil {
		return 0, err
	}

	newRecord, err := pg.Queries.CreateMedicineItem(ctx, db.CreateMedicineItemParams{
		Name:                  payload.Name,
		Dosage:                encoded,
		TreatmentDurationDays: 0,
		Schedule:              payload.Schedule,
		RemindPatient:         true,
		DisableForPatient:     false,
	})
	if err != nil {
		return 0, err
	}
	return newRecord.ID, nil
}

func (pg *pgMedicine) GetMedicineRecord(ctx context.Context, id int64) (models.MedicineItem, error) {
	record, err := pg.Queries.GetMedicineItem(ctx, id)
	if err != nil {
		return models.MedicineItem{}, err
	}

	var dosage models.Dosage
	if err := json.Unmarshal(record.Dosage, &dosage); err != nil {
		return models.MedicineItem{}, err
	}

	return models.MedicineItem{
		ID:                    record.ID,
		Name:                  record.Name,
		Dosage:                dosage,
		TreatmentDurationDays: int(record.TreatmentDurationDays),
		Schedule:              record.Schedule,
		RemindPatient:         record.RemindPatient,
		DisableForPatient:     record.DisableForPatient,
	}, nil
}

func (pg *pgMedicine) ListAllRecords(ctx context.Context) ([]models.MedicineItem, error) {
	records, err := pg.Queries.ListMedicineItemsForDoctor(ctx)
	if err != nil {
		return nil, err
	}
	var items []models.MedicineItem

	for _, record := range records {
		var dosage models.Dosage
		if err := json.Unmarshal(record.Dosage, &dosage); err != nil {
			return nil, err
		}

		items = append(items, models.MedicineItem{
			ID:                    record.ID,
			Name:                  record.Name,
			Dosage:                dosage,
			TreatmentDurationDays: int(record.TreatmentDurationDays),
			Schedule:              record.Schedule,
			RemindPatient:         record.RemindPatient,
			DisableForPatient:     record.DisableForPatient,
		})
	}

	return items, nil
}

func (pg *pgMedicine) ListForPatient(ctx context.Context, patientID int64) ([]models.MedicineItem, error) {
	records, err := pg.Queries.ListMedicineItemsForPatient(ctx, pgtype.Int8{Valid: true, Int64: patientID})
	if err != nil {
		return nil, err
	}
	var items []models.MedicineItem

	for _, record := range records {
		var dosage models.Dosage
		if err := json.Unmarshal(record.Dosage, &dosage); err != nil {
			return nil, err
		}

		items = append(items, models.MedicineItem{
			ID:                    record.ID,
			Name:                  record.Name,
			Dosage:                dosage,
			TreatmentDurationDays: int(record.TreatmentDurationDays),
			Schedule:              record.Schedule,
			RemindPatient:         record.RemindPatient,
			DisableForPatient:     record.DisableForPatient,
		})
	}

	return items, nil
}

func (pg *pgMedicine) AssignMedicine(ctx context.Context, doctorId, patientID, medicineID int64) error {
	return pg.Queries.AssignMedicineItemToPatient(ctx, db.AssignMedicineItemToPatientParams{
		PatientID: pgtype.Int8{
			Int64: patientID,
			Valid: true,
		},
		MedicineID: pgtype.Int8{
			Int64: medicineID,
			Valid: true,
		},
		FkDoctorID: pgtype.Int8{
			Int64: doctorId,
			Valid: true,
		},
	})
}
