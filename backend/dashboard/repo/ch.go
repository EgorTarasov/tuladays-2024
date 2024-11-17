package repo

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/EgorTarasov/tuladays/dashboard/models"
)

type ch struct {
	db *sql.DB
}

func NewHealthData(db *sql.DB) HealthDataRepo {
	return &ch{
		db: db,
	}
}

func (c *ch) GetHeartRateData(ctx context.Context, patientID int64) (uint8, uint8, uint8, error) {
	query := `SELECT
	heart_rate,
	timestamp,
	systolic_pressure,
	diastolic_pressure
FROM heart_data
WHERE patient_id = $1
ORDER BY timestamp DESC
LIMIT 1;
`
	var heartRate, systolicPressure, diastolicPressure int
	var timestamp time.Time
	err := c.db.QueryRow(query, patientID).Scan(&heartRate, &timestamp, &systolicPressure, &diastolicPressure)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, 0, 0, nil // No data found
		}
		return 0, 0, 0, fmt.Errorf("failed to query heart data: %w", err)
	}

	return uint8(heartRate), uint8(systolicPressure), uint8(diastolicPressure), nil
}

func (c *ch) GetHeartRateGraph(ctx context.Context, patientID int64) ([]models.Graph, error) {
	query := `SELECT
	heart_rate,
	timestamp,
	systolic_pressure,
	diastolic_pressure
FROM heart_data
WHERE patient_id = $1
ORDER BY timestamp DESC
LIMIT 1;
`
	rows, err := c.db.Query(query, patientID)
	if err != nil {
		return nil, fmt.Errorf("failed to query heart data: %w", err)
	}
	defer rows.Close()

	graphs := []models.Graph{
		{
			Title: "Сердечный ритм",
			XAxis: "Дата",
			YAxis: "Удары в минуту",
		},
		{
			Title: "Давление (систолическое)",
			XAxis: "Дата",
			YAxis: "Мм рт. ст.",
		},
		{
			Title: "Давление (диастолическое)",
			XAxis: "Дата",
			YAxis: "Мм рт. ст.",
		},
	}
	for rows.Next() {
		var heartRate, systolicPressure, diastolicPressure int
		var timestamp time.Time
		if err := rows.Scan(&heartRate, &timestamp, &systolicPressure, &diastolicPressure); err != nil {
			return nil, fmt.Errorf("failed to scan heart data: %w", err)
		}

		graphs[0].Data = append(graphs[0].Data, models.GraphRecord{
			Date: timestamp.Format("2006-01-02 15:04:05"),
			Info: heartRate,
		})
		graphs[1].Data = append(graphs[1].Data, models.GraphRecord{
			Date: timestamp.Format("2006-01-02 15:04:05"),
			Info: systolicPressure,
		})
		graphs[2].Data = append(graphs[2].Data, models.GraphRecord{
			Date: timestamp.Format("2006-01-02 15:04:05"),
			Info: diastolicPressure,
		})
	}

	return graphs, nil
}

func (c *ch) GetOxygenData(ctx context.Context, patientID int64) (uint8, error) {
	query := `SELECT
	blood_oxygen_level
	FROM blood_oxygen_data
	WHERE patient_id = $1
	ORDER BY timestamp DESC
	LIMIT 1;`
	var blood_oxygen_data int
	err := c.db.QueryRow(query, patientID).Scan(&blood_oxygen_data)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // No data found
		}
		return 0, fmt.Errorf("failed to query oxygen data: %w", err)
	}

	return uint8(blood_oxygen_data), nil
}

func (c *ch) GetSugarData(ctx context.Context, patientID int64) (float32, error) {
	query := `SELECT
	sugar_level
	FROM sugar_level_data
	WHERE patient_id = $1
	ORDER BY timestamp DESC
	LIMIT 1;`
	var sugar_level_data float32
	err := c.db.QueryRow(query, patientID).Scan(&sugar_level_data)
	if err != nil {
		if err == sql.ErrNoRows {
			return 0, nil // No data found
		}
		return 0, fmt.Errorf("failed to query oxygen data: %w", err)
	}

	return float32(sugar_level_data), nil
}
