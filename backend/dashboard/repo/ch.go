package repo

import (
	"context"
	"database/sql"
	"fmt"
	"time"
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
