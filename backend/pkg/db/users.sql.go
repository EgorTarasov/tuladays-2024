// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: users.sql

package db

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const assignRoleToUser = `-- name: AssignRoleToUser :one
INSERT INTO user_roles (user_id, role_id)
VALUES ($1, $2)
RETURNING user_id,
    role_id
`

type AssignRoleToUserParams struct {
	UserID int32
	RoleID int32
}

func (q *Queries) AssignRoleToUser(ctx context.Context, arg AssignRoleToUserParams) (UserRole, error) {
	row := q.db.QueryRow(ctx, assignRoleToUser, arg.UserID, arg.RoleID)
	var i UserRole
	err := row.Scan(&i.UserID, &i.RoleID)
	return i, err
}

const assignUserToDoctor = `-- name: AssignUserToDoctor :exec
INSERT INTO doctors_patients (doctor_id, patient_id)
VALUES ($1, $2)
`

type AssignUserToDoctorParams struct {
	DoctorID  pgtype.Int8
	PatientID pgtype.Int8
}

func (q *Queries) AssignUserToDoctor(ctx context.Context, arg AssignUserToDoctorParams) error {
	_, err := q.db.Exec(ctx, assignUserToDoctor, arg.DoctorID, arg.PatientID)
	return err
}

const createOAuthProvider = `-- name: CreateOAuthProvider :one
INSERT INTO oauth_providers (name)
VALUES ($1)
RETURNING id,
    name
`

func (q *Queries) CreateOAuthProvider(ctx context.Context, name string) (OauthProvider, error) {
	row := q.db.QueryRow(ctx, createOAuthProvider, name)
	var i OauthProvider
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}

const createOAuthUser = `-- name: CreateOAuthUser :one
INSERT INTO oauth_users (user_id, provider_id, provider_user_id)
VALUES ($1, $2, $3)
RETURNING id,
    user_id,
    provider_id,
    provider_user_id
`

type CreateOAuthUserParams struct {
	UserID         pgtype.Int4
	ProviderID     pgtype.Int4
	ProviderUserID string
}

func (q *Queries) CreateOAuthUser(ctx context.Context, arg CreateOAuthUserParams) (OauthUser, error) {
	row := q.db.QueryRow(ctx, createOAuthUser, arg.UserID, arg.ProviderID, arg.ProviderUserID)
	var i OauthUser
	err := row.Scan(
		&i.ID,
		&i.UserID,
		&i.ProviderID,
		&i.ProviderUserID,
	)
	return i, err
}

const createRole = `-- name: CreateRole :one
INSERT INTO roles (name)
VALUES ($1)
RETURNING id,
    name
`

func (q *Queries) CreateRole(ctx context.Context, name string) (Role, error) {
	row := q.db.QueryRow(ctx, createRole, name)
	var i Role
	err := row.Scan(&i.ID, &i.Name)
	return i, err
}

const createUser = `-- name: CreateUser :one
INSERT INTO users (email, password_hash)
VALUES ($1, $2)
RETURNING id,
    email,
    password_hash,
    created_at,
    updated_at
`

type CreateUserParams struct {
	Email        string
	PasswordHash pgtype.Text
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRow(ctx, createUser, arg.Email, arg.PasswordHash)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getRoleIdByName = `-- name: GetRoleIdByName :one
SELECT r.id
FROM roles r
where r.name = $1
`

func (q *Queries) GetRoleIdByName(ctx context.Context, name string) (int32, error) {
	row := q.db.QueryRow(ctx, getRoleIdByName, name)
	var id int32
	err := row.Scan(&id)
	return id, err
}

const getUserWithRoles = `-- name: GetUserWithRoles :one
SELECT u.id,
    u.email,
    u.password_hash,
    u.created_at,
    u.updated_at,
    r.name AS role
FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = $1
`

type GetUserWithRolesRow struct {
	ID           int32
	Email        string
	PasswordHash pgtype.Text
	CreatedAt    pgtype.Timestamp
	UpdatedAt    pgtype.Timestamp
	Role         pgtype.Text
}

func (q *Queries) GetUserWithRoles(ctx context.Context, email string) (GetUserWithRolesRow, error) {
	row := q.db.QueryRow(ctx, getUserWithRoles, email)
	var i GetUserWithRolesRow
	err := row.Scan(
		&i.ID,
		&i.Email,
		&i.PasswordHash,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.Role,
	)
	return i, err
}

const listOAuthUsers = `-- name: ListOAuthUsers :many
SELECT id,
    user_id,
    provider_id,
    provider_user_id
FROM oauth_users
`

func (q *Queries) ListOAuthUsers(ctx context.Context) ([]OauthUser, error) {
	rows, err := q.db.Query(ctx, listOAuthUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []OauthUser
	for rows.Next() {
		var i OauthUser
		if err := rows.Scan(
			&i.ID,
			&i.UserID,
			&i.ProviderID,
			&i.ProviderUserID,
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

const listRolesForUser = `-- name: ListRolesForUser :many
SELECT r.name
FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    JOIN users u ON ur.user_id = u.id
WHERE u.email = $1
`

func (q *Queries) ListRolesForUser(ctx context.Context, email string) ([]string, error) {
	rows, err := q.db.Query(ctx, listRolesForUser, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		items = append(items, name)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listUserRoles = `-- name: ListUserRoles :many
SELECT user_id,
    role_id
FROM user_roles
`

func (q *Queries) ListUserRoles(ctx context.Context) ([]UserRole, error) {
	rows, err := q.db.Query(ctx, listUserRoles)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []UserRole
	for rows.Next() {
		var i UserRole
		if err := rows.Scan(&i.UserID, &i.RoleID); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const listUsers = `-- name: ListUsers :many
SELECT id,
    email,
    password_hash,
    created_at,
    updated_at
FROM users
`

func (q *Queries) ListUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.Query(ctx, listUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(
			&i.ID,
			&i.Email,
			&i.PasswordHash,
			&i.CreatedAt,
			&i.UpdatedAt,
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

const uploadExternalUserData = `-- name: UploadExternalUserData :exec
INSERT into external_data (
        external_id,
        fk_user_id,
        first_name,
        last_name,
        middle_name,
        sex,
        dob,
        email,
        address,
        risk_of_disease,
        diagnosis
    )
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
`

type UploadExternalUserDataParams struct {
	ExternalID    string
	FkUserID      pgtype.Int8
	FirstName     string
	LastName      string
	MiddleName    string
	Sex           string
	Dob           pgtype.Date
	Email         string
	Address       string
	RiskOfDisease pgtype.Numeric
	Diagnosis     pgtype.Text
}

func (q *Queries) UploadExternalUserData(ctx context.Context, arg UploadExternalUserDataParams) error {
	_, err := q.db.Exec(ctx, uploadExternalUserData,
		arg.ExternalID,
		arg.FkUserID,
		arg.FirstName,
		arg.LastName,
		arg.MiddleName,
		arg.Sex,
		arg.Dob,
		arg.Email,
		arg.Address,
		arg.RiskOfDisease,
		arg.Diagnosis,
	)
	return err
}
