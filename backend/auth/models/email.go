package models

import (
	"errors"
	"strconv"
	"time"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type UserData struct {
	UserID int64         `json:"user_id"`
	Role   auth.UserRole `json:"role"`
}

type CreateUser struct {
	Email    string
	Password string
}

type LoginData struct {
	Email    string
	Password string
}

type User struct {
	ID           int64
	Email        string
	PasswordHash Password
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Role         auth.UserRole
}

type ExternalData struct {
	UserID        int64
	ExternalID    string
	FirstName     string
	LastName      string
	MiddleName    string
	Sex           string
	Dob           time.Time
	Email         string
	Address       string
	RiskOfDisease float64
	Diagnosis     string
}

type Password string

func NewHashedPassword(v string) (Password, error) {
	res, err := bcrypt.GenerateFromPassword([]byte(v), 14)
	return Password(res), err
}

func (p Password) ComparePassword(v string) error {
	return bcrypt.CompareHashAndPassword([]byte(p), []byte(v))
}

type claims struct {
	UserData
	jwt.RegisteredClaims
}

type AuthToken string

func NewAuthToken(u UserData, secret string) (AuthToken, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &claims{
		UserData: u,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			Subject:   strconv.FormatInt(u.UserID, 10),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", auth.ErrUnableToCreateToken
	}

	return AuthToken(tokenString), nil
}

func (at AuthToken) Validate(secret string) error {
	token, err := jwt.Parse(string(at), func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return auth.ErrInvalidToken
		}
		return auth.ErrInvalidToken
	}
	if !token.Valid {
		return auth.ErrInvalidToken
	}

	return nil
}

func (at AuthToken) Decode() (result UserData, err error) {
	token, _, err := new(jwt.Parser).ParseUnverified(string(at), &claims{})
	if err != nil {
		return result, auth.ErrUnableToDecodeToken
	}

	claims, ok := token.Claims.(*claims)
	if !ok {
		return result, auth.ErrUnableToDecodeToken
	}

	return claims.UserData, nil
}
