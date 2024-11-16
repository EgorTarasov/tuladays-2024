-- name: GetPatientById :one
SELECT *
from external_data
WHERE fk_user_id = $1
LIMIT 1;
-- name: GetPatientsByDoctorID :many
SELECT ed.*
FROM external_data ed
    JOIN users u on ed.fk_user_id = u.id
    JOIN doctors_patients dp on u.id = dp.patient_id
WHERE dp.doctor_id = $1
LIMIT $2 OFFSET $3;