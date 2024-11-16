package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func (h *handler) UploadExternalData(c *fiber.Ctx) error {
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
	err = h.s.ProcessCSV(c.Context(), file)

	if err != nil {
		log.Err(err).Msg("unable to process external CSV")
	}

	return nil
}
