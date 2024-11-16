-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS external_data(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    external_id TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT NOT NULL,
    sex TEXT NOT NULL,
    email TEXT NOT NULL,
    dob DATE NOT NULL,
    address TEXT NOT NULL,
    risk_of_disease NUMERIC NOT NULL DEFAULT 0.0,
    diagnosis TEXT DEFAULT NULL,
    fk_user_id BIGINT REFERENCES users(id) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);
CREATE TABLE IF NOT EXISTS telegram_data(
    telegram_id BIGINT PRIMARY KEY NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    language_code TEXT,
    last_activity TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS telegram_data_user_id_idx ON telegram_data(user_id);
CREATE TABLE IF NOT EXISTS patient_notifications(
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    notification TEXT NOT NULL,
    requested_measurement TEXT NOT NULL,
    response_data JSON DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS patient_notifications;
DROP TABLE IF EXISTS telegram_data;
DROP TABLE IF EXISTS external_data;
-- +goose StatementEnd