package repo

import (
	"context"
	"database/sql"
)

type ch struct {
	db *sql.DB
}

func NewHealthData(db *sql.DB) HealthDataRepo {
	return &ch{
		db: db,
	}
}

func (c *ch) GetHeartRateData(ctx context.Context, id int64) (uint8, uint8, uint8, error) {
	return 0, 0, 0, nil
}
