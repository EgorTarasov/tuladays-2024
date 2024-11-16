-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS medicine_items (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    dosage JSON NOT NULL,
    treatment_duration_days INT NOT NULL,
    schedule TEXT [] NOT NULL,
    remind_patient BOOLEAN NOT NULL,
    disable_for_patient BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS patients_medicine (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    medicine_id BIGINT REFERENCES medicine_items(id) ON DELETE CASCADE,
    fk_doctor_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS patients_medicine;
DROP TABLE IF EXISTS medicine_items;
-- +goose StatementEnd