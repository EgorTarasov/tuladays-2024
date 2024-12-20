// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type Chat struct {
	ID        int64
	Title     string
	CreatedAt pgtype.Timestamp
	UpdatedAt pgtype.Timestamp
	DeletedAt pgtype.Timestamp
}

type DoctorsPatient struct {
	ID        int64
	DoctorID  pgtype.Int8
	PatientID pgtype.Int8
	CreatedAt pgtype.Timestamp
	UpdatedAt pgtype.Timestamp
	DeletedAt pgtype.Timestamp
}

type ExternalDatum struct {
	ID            int64
	UserID        pgtype.Int8
	ExternalID    string
	FirstName     string
	LastName      string
	MiddleName    string
	Sex           string
	Email         string
	Dob           pgtype.Date
	Address       string
	RiskOfDisease pgtype.Numeric
	Diagnosis     pgtype.Text
	FkUserID      pgtype.Int8
	CreatedAt     pgtype.Timestamp
	UpdatedAt     pgtype.Timestamp
	DeletedAt     pgtype.Timestamp
}

type MedicineItem struct {
	ID                    int64
	Name                  string
	Dosage                []byte
	TreatmentDurationDays int32
	Schedule              []string
	RemindPatient         bool
	DisableForPatient     bool
	CreatedAt             pgtype.Timestamp
	UpdatedAt             pgtype.Timestamp
}

type Message struct {
	ID        int64
	ChatID    pgtype.Int8
	UserID    pgtype.Int8
	Text      string
	Metadata  []byte
	CreatedAt pgtype.Timestamp
	UpdatedAt pgtype.Timestamp
	DeletedAt pgtype.Timestamp
}

type MessageStatus struct {
	MessageID int64
	UserID    int64
	Read      pgtype.Bool
	Notified  pgtype.Bool
}

type OauthProvider struct {
	ID   int32
	Name string
}

type OauthUser struct {
	ID             int32
	UserID         pgtype.Int4
	ProviderID     pgtype.Int4
	ProviderUserID string
}

type PatientNotification struct {
	ID                   int64
	PatientID            pgtype.Int8
	Notification         string
	RequestedMeasurement string
	ResponseData         []byte
	CreatedAt            pgtype.Timestamp
	UpdatedAt            pgtype.Timestamp
	DeletedAt            pgtype.Timestamp
}

type PatientsMedicine struct {
	ID         int64
	PatientID  pgtype.Int8
	MedicineID pgtype.Int8
	FkDoctorID pgtype.Int8
	CreatedAt  pgtype.Timestamp
	UpdatedAt  pgtype.Timestamp
}

type Role struct {
	ID   int32
	Name string
}

type Roster struct {
	ChatID int64
	UserID int64
}

type TelegramDatum struct {
	TelegramID   int64
	UserID       pgtype.Int8
	Username     pgtype.Text
	FirstName    pgtype.Text
	LastName     pgtype.Text
	LanguageCode pgtype.Text
	LastActivity pgtype.Timestamp
	CreatedAt    pgtype.Timestamp
	UpdatedAt    pgtype.Timestamp
	DeletedAt    pgtype.Timestamp
}

type User struct {
	ID           int32
	Email        string
	PasswordHash pgtype.Text
	CreatedAt    pgtype.Timestamp
	UpdatedAt    pgtype.Timestamp
}

type UserRole struct {
	UserID int32
	RoleID int32
}
