-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS heart_data (
    id UUID DEFAULT generateUUIDv4(),
    patient_id Int64,
    -- external_data (id)
    timestamp DateTime DEFAULT now(),
    heart_rate UInt32,
    systolic_pressure UInt32,
    diastolic_pressure UInt32
) ENGINE = MergeTree()
ORDER BY (patient_id, timestamp);
-- +goose StatementEnd
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS blood_oxygen_data (
    id UUID DEFAULT generateUUIDv4(),
    patient_id Int64,
    -- external_data (id)
    timestamp DateTime DEFAULT now(),
    blood_oxygen_level UInt8 -- 0 - 100 percent
) ENGINE = MergeTree()
ORDER BY (patient_id, timestamp);
-- +goose StatementEnd
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS sugar_level_data (
    id UUID DEFAULT generateUUIDv4(),
    patient_id Int64,
    -- external_data (id)
    timestamp DateTime DEFAULT now(),
    sugar_level Float32 -- Sugar level measurement
) ENGINE = MergeTree()
ORDER BY (patient_id, timestamp);
-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS sugar_level_data;
DROP TABLE IF EXISTS blood_oxygen_data;
DROP TABLE IF EXISTS heart_data;
-- +goose StatementEnd