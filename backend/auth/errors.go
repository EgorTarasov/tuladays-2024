package auth

import "errors"

var (
	ErrInvalidToken        = errors.New("invalid auth token")
	ErrUnableToCreateToken = errors.New("unable to create jwt token")
	ErrUserNotFound        = errors.New("user not found")
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrUnableToDecodeToken = errors.New("unable to decode jwt token")
	ErrUnableToAddExtUser  = errors.New("unable to add external user")
	ErrUnableToAssignUser  = errors.New("unable to assign user")
)
