-- name: CreateUser :one
INSERT INTO users (email, password_hash)
VALUES ($1, $2)
RETURNING id,
    email,
    password_hash,
    created_at,
    updated_at;
-- name: CreateOAuthProvider :one
INSERT INTO oauth_providers (name)
VALUES ($1)
RETURNING id,
    name;
-- name: CreateOAuthUser :one
INSERT INTO oauth_users (user_id, provider_id, provider_user_id)
VALUES ($1, $2, $3)
RETURNING id,
    user_id,
    provider_id,
    provider_user_id;
-- name: CreateRole :one
INSERT INTO roles (name)
VALUES ($1)
RETURNING id,
    name;
-- name: AssignRoleToUser :one
INSERT INTO user_roles (user_id, role_id)
VALUES ($1, $2)
RETURNING user_id,
    role_id;
-- name: ListUsers :many
SELECT id,
    email,
    password_hash,
    created_at,
    updated_at
FROM users;
-- name: ListOAuthUsers :many
SELECT id,
    user_id,
    provider_id,
    provider_user_id
FROM oauth_users;
-- name: ListUserRoles :many
SELECT user_id,
    role_id
FROM user_roles;
-- name: ListRolesForUser :many
SELECT r.name
FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    JOIN users u ON ur.user_id = u.id
WHERE u.email = $1;
-- name: GetUserWithRoles :one
SELECT u.id,
    u.email,
    u.password_hash,
    u.created_at,
    u.updated_at,
    r.name AS role
FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = $1;
-- name: UploadExternalUserData :exec
INSERT into external_data (external_id, fk_user_id, first_name, last_name, middle_name, sex, dob, email, address, risk_of_disease, diagnosis)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
