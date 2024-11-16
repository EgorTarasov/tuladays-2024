package handlers

import (
	"strconv"

	"github.com/EgorTarasov/tuladays/auth/models"
	authModels "github.com/EgorTarasov/tuladays/auth/models"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

func (h *handler) GetDashboardForUser(c *fiber.Ctx) error {
	userData := c.Locals("userData").(models.UserData)
	log.Info().Interface("userData", userData).Msg("test")
	patientIDParam := c.Params("id")
	if patientIDParam == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "missing patient ID",
		})
	}

	patientID, err := strconv.ParseInt(patientIDParam, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid patient ID",
		})
	}

	result, err := h.s.GetDashboardForUser(c.Context(), patientID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(result)
}

func (h *handler) GetPatients(c *fiber.Ctx) error {
	authToken := c.Get("authToken")
	if authToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "missing authToken",
		})
	}

	token := authModels.AuthToken(authToken)
	userData, err := token.Decode()
	if err != nil || userData.Role != "doctor" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid authToken",
		})
	}

	result, err := h.s.GetPatients(c.Context(), userData.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(result)
}
