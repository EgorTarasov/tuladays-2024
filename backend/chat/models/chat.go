package models

import "time"

type Chat struct {
	ID        int64
	Title     string
	CreatedAt time.Time
	UpdatedAt time.Time
}
