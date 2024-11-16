package service

import (
	"context"
	"encoding/csv"
	"io"

	"github.com/rs/zerolog/log"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
)

func (s *service) ProcessCSV(ctx context.Context, reader io.Reader) error {
	csvReader := csv.NewReader(reader)

	records, err := csvReader.ReadAll()
	if err != nil {
	}

	for _, record := range records {
		email := record[4]
		pwd, err := models.NewHashedPassword("test123")
		if err != nil {
			log.Err(err).Msg("Could not hash password")
			return auth.ErrUnableToAddExtUser
		}
		_, err = s.users.CreateUser(ctx, email, pwd)
		if err != nil {
			log.Err(err).Msg("Could not create external user")
			return auth.ErrUnableToAddExtUser
		}

	}
	return nil
}
