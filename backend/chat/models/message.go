package models

import "time"

type Message struct {
	ID        int64
	ChatID    int64
	UserID    int64
	Text      string
	Metadata  map[any]any
	CreatedAt time.Time
	UpdatedAt time.Time
	Deleted   bool
}
