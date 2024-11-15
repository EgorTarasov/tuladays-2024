package repo

import (
	"context"
	"errors"

	"github.com/EgorTarasov/tuladays/chat/models"
	"github.com/EgorTarasov/tuladays/pkg/db"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
)

type pg struct {
	*db.Queries
	pool *pgxpool.Pool
}

func NewPgRepo(pool *pgxpool.Pool) ChatRepo {
	return &pg{
		Queries: db.New(pool),
		pool:    pool,
	}
}

func (repo *pg) CreateChat(ctx context.Context, userID int64, title string) (models.Chat, error) {
	var chat models.Chat
	tx, err := repo.pool.Begin(ctx)
	if err != nil {
		return chat, errors.New("invalid ")
	}
	defer tx.Rollback(ctx)

	dbChat, err := repo.Queries.CreateChat(ctx, title)
	if err != nil {
		return chat, err
	}
	chat = models.Chat{
		ID:        dbChat.ID,
		Title:     dbChat.Title,
		CreatedAt: dbChat.CreatedAt.Time,
		UpdatedAt: dbChat.UpdatedAt.Time,
	}

	if err = repo.CreateRoster(ctx, db.CreateRosterParams{
		ChatID: chat.ID,
		UserID: userID,
	}); err != nil {
		// TODO: add custom error
		return chat, err
	}

	if err := tx.Commit(ctx); err != nil {
		log.Err(err).Msg("unable to commit new chat")
		// TODO: add custom error
		return chat, err
	}

	return models.Chat{}, nil
}
func (repo *pg) SaveMessage(ctx context.Context, msg models.Message) error {
	if _, err := repo.Queries.InsertMessage(ctx, db.InsertMessageParams{
		ChatID: pgtype.Int8{
			Int64: msg.ChatID,
			Valid: true,
		},
		UserID: pgtype.Int8{
			Int64: msg.ChatID,
			Valid: true,
		},
		Text:     msg.Text,
		Metadata: []byte{},
	}); err != nil {
		// TODO: add custom error
		return err
	}
	return nil
}

func (repo *pg) ListMessages(ctx context.Context, userID int64) ([]models.Message, error) {
	var messages []models.Message
	dbMessages, err := repo.Queries.ListMessages(ctx, userID)
	if err != nil {
		return nil, err
	}

	for _, msg := range dbMessages {
		messages = append(messages, models.Message{
			ID:        msg.ID,
			ChatID:    msg.ChatID.Int64,
			UserID:    msg.UserID.Int64,
			Text:      msg.Text,
			Metadata:  map[any]any{},
			CreatedAt: msg.CreatedAt.Time,
			UpdatedAt: msg.UpdatedAt.Time,
			Deleted:   false,
		})
	}
	return messages, nil
}
