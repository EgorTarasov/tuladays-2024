package repo

import (
	"context"

	"github.com/EgorTarasov/tuladays/chat/models"
)

type ChatRepo interface {
	CreateChat(ctx context.Context, userID int64, title string) (models.Chat, error)
	SaveMessage(ctx context.Context, msg models.Message) error
	ListMessages(ctx context.Context, userID int64) ([]models.Message, error)
}
