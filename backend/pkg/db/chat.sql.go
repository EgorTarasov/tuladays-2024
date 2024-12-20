// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: chat.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const createChat = `-- name: CreateChat :one
INSERT INTO chat (title)
VALUES ($1)
RETURNING id,
    title,
    created_at,
    updated_at,
    deleted_at
`

func (q *Queries) CreateChat(ctx context.Context, title string) (Chat, error) {
	row := q.db.QueryRow(ctx, createChat, title)
	var i Chat
	err := row.Scan(
		&i.ID,
		&i.Title,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const createRoster = `-- name: CreateRoster :exec
INSERT INTO roster (chat_id, user_id)
VALUES ($1, $2)
`

type CreateRosterParams struct {
	ChatID int64
	UserID int64
}

func (q *Queries) CreateRoster(ctx context.Context, arg CreateRosterParams) error {
	_, err := q.db.Exec(ctx, createRoster, arg.ChatID, arg.UserID)
	return err
}

const deleteMessage = `-- name: DeleteMessage :exec
UPDATE messages
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = $1
`

func (q *Queries) DeleteMessage(ctx context.Context, id int64) error {
	_, err := q.db.Exec(ctx, deleteMessage, id)
	return err
}

const insertMessage = `-- name: InsertMessage :one
INSERT INTO messages (chat_id, user_id, text, metadata)
VALUES ($1, $2, $3, $4)
RETURNING id,
    chat_id,
    user_id,
    text,
    metadata,
    created_at,
    updated_at,
    deleted_at
`

type InsertMessageParams struct {
	ChatID   pgtype.Int8
	UserID   pgtype.Int8
	Text     string
	Metadata []byte
}

func (q *Queries) InsertMessage(ctx context.Context, arg InsertMessageParams) (Message, error) {
	row := q.db.QueryRow(ctx, insertMessage,
		arg.ChatID,
		arg.UserID,
		arg.Text,
		arg.Metadata,
	)
	var i Message
	err := row.Scan(
		&i.ID,
		&i.ChatID,
		&i.UserID,
		&i.Text,
		&i.Metadata,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.DeletedAt,
	)
	return i, err
}

const listChats = `-- name: ListChats :many
SELECT c.id,
    c.title,
    c.created_at,
    c.updated_at,
    c.deleted_at
FROM chat c
    JOIN roster r ON c.id = r.chat_id
WHERE r.user_id = $1
`

func (q *Queries) ListChats(ctx context.Context, userID int64) ([]Chat, error) {
	rows, err := q.db.Query(ctx, listChats, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Chat
	for rows.Next() {
		var i Chat
		if err := rows.Scan(
			&i.ID,
			&i.Title,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DeletedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listMessages = `-- name: ListMessages :many
SELECT m.id,
    m.chat_id,
    m.user_id,
    m.text,
    m.metadata,
    m.created_at,
    m.updated_at,
    m.deleted_at
FROM messages m
    JOIN roster r ON m.chat_id = r.chat_id
WHERE r.user_id = $1
`

func (q *Queries) ListMessages(ctx context.Context, userID int64) ([]Message, error) {
	rows, err := q.db.Query(ctx, listMessages, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Message
	for rows.Next() {
		var i Message
		if err := rows.Scan(
			&i.ID,
			&i.ChatID,
			&i.UserID,
			&i.Text,
			&i.Metadata,
			&i.CreatedAt,
			&i.UpdatedAt,
			&i.DeletedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateMessage = `-- name: UpdateMessage :exec
UPDATE messages
SET text = $1,
    metadata = $2
WHERE id = $3
`

type UpdateMessageParams struct {
	Text     string
	Metadata []byte
	ID       int64
}

func (q *Queries) UpdateMessage(ctx context.Context, arg UpdateMessageParams) error {
	_, err := q.db.Exec(ctx, updateMessage, arg.Text, arg.Metadata, arg.ID)
	return err
}
