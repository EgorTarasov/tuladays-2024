package handlers

import (
	"strconv"

	"github.com/EgorTarasov/tuladays/auth/models"
	"github.com/gofiber/fiber/v2"
)

func (h *handler) GetDashboardForUser(c *fiber.Ctx) error {

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
	userData := c.Locals("userData").(models.UserData)

	limitStr := c.Query("limit")
	offsetStr := c.Query("offset")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		limit = 10
	}
	offset, err := strconv.Atoi(offsetStr)
	if err != nil {
		offset = 0
	}

	result, err := h.s.GetPatients(c.Context(), userData.UserID, limit, offset)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.JSON(result)
}

func (h *handler) GetPatientsList(c *fiber.Ctx) error {
	// limitStr := c.Query("limit")
	// offsetStr := c.Query("offset")

	// limit, err := strconv.Atoi(limitStr)
	// if err != nil {
	// 	limit = 10
	// }
	// offset, err := strconv.Atoi(offsetStr)
	// if err != nil {
	// 	offset = 0
	// }

	return nil
}
