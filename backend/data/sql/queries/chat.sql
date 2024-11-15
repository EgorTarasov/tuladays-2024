-- name: CreateChat :one
INSERT INTO chat (title)
VALUES ($1)
RETURNING id,
    title,
    created_at,
    updated_at,
    deleted_at;
-- name: CreateRoster :exec
INSERT INTO roster (chat_id, user_id)
VALUES ($1, $2);
-- name: InsertMessage :one
INSERT INTO messages (chat_id, user_id, text, metadata)
VALUES ($1, $2, $3, $4)
RETURNING id,
    chat_id,
    user_id,
    text,
    metadata,
    created_at,
    updated_at,
    deleted_at;
-- name: UpdateMessage :exec
UPDATE messages
SET text = $1,
    metadata = $2
WHERE id = $3;
-- name: DeleteMessage :exec
UPDATE messages
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = $1;
-- name: ListChats :many
SELECT c.id,
    c.title,
    c.created_at,
    c.updated_at,
    c.deleted_at
FROM chat c
    JOIN roster r ON c.id = r.chat_id
WHERE r.user_id = $1;
-- name: ListMessages :many
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
WHERE r.user_id = $1;