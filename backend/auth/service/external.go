package service

import (
	"context"
	"encoding/csv"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/rs/zerolog/log"

	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/auth/models"
)

func (s *service) ProcessCSV(ctx context.Context, reader io.Reader, doctorID int64) error {

	csvReader := csv.NewReader(reader)

	records, err := csvReader.ReadAll()
	if err != nil {
	}

	for _, record := range records[1:] {
		email := record[4]
		pwd, err := models.NewHashedPassword("test123")
		if err != nil {
			log.Err(err).Msg("Could not hash password")
			return auth.ErrUnableToAddExtUser
		}
		newID, err := s.users.CreateUser(ctx, email, pwd, auth.Patient)
		if err != nil {
			log.Err(err).Msg("Could not create external user")
			return auth.ErrUnableToAddExtUser
		}

		RiskOfDisease, err := strconv.ParseFloat(record[6], 64)
		if err != nil {
			log.Err(err).Msg("Could not parse external user")
			return auth.ErrUnableToAddExtUser
		}

		Dob, err := time.Parse("2006-01-02", record[3])

		if err != nil {
			log.Err(err).Msg("Could not parse external user")
			return auth.ErrUnableToAddExtUser
		}
		user_name := strings.Split(record[1], " ")
		err = s.users.UploadExternalUserData(ctx, models.ExternalData{
			UserID:        newID,
			ExternalID:    record[0],
			FirstName:     user_name[0],
			LastName:      user_name[1],
			MiddleName:    user_name[2],
			Sex:           record[2],
			Dob:           Dob,
			Email:         record[4],
			Address:       record[5],
			RiskOfDisease: RiskOfDisease,
			Diagnosis:     record[7],
		})
		if err != nil {
			log.Err(err).Msg("Could not parse external user")
			return auth.ErrUnableToAddExtUser
		}
		err = s.users.AssignUserToDoctor(ctx, newID, doctorID)
		if err != nil {
			log.Err(err).Msg("Could not assign user to doctor")
			return auth.ErrUnableToAssignUser
		}
	}
	return nil
}
