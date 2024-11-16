-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS doctors_patients (
    id BIGSERIAL PRIMARY KEY,
    doctor_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    patient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NULL
);
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS doctors_patients;
-- +goose StatementEnd