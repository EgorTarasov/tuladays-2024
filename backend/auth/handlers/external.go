package handlers

import (
	"github.com/EgorTarasov/tuladays/auth/models"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func (h *handler) UploadExternalData(c *fiber.Ctx) error {
	userData := c.Locals("userData").(models.UserData)
	csvData, err := c.FormFile("document")
	if err != nil {
		log.Err(err).Msg("unable to process external CSV")
		return c.SendStatus(fiber.StatusBadRequest)
	}

	file, err := csvData.Open()
	if err != nil {
		log.Err(err).Msg("unable to open external CSV")
		return c.SendStatus(fiber.StatusBadRequest)
	}
	err = h.s.ProcessCSV(c.Context(), file, userData.UserID)

	if err != nil {
		log.Err(err).Msg("unable to process external CSV")
	}

	return nil
}
