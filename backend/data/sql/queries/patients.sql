-- name: GetPatientById :one
SELECT * from external_data
WHERE user_id = $1 LIMIT 1;
