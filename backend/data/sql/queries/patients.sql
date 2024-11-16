-- name: GetPatientById :one
SELECT *
from external_data
WHERE fk_user_id = $1
LIMIT 1;