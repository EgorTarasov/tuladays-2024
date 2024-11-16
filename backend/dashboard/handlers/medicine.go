package handlers

import (
	"strconv"

	"github.com/EgorTarasov/tuladays/dashboard/models"
	"github.com/gofiber/fiber/v2"
)

func (h *handler) CreateMedicineRecord(c *fiber.Ctx) error {
	var payload models.MedicineCreate
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
	}

	id, err := h.s.CreateMedicineRecord(c.Context(), payload)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"id": id})
}

func (h *handler) GetMedicineRecord(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid id"})
	}

	record, err := h.s.GetMedicineRecord(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(record)
}

func (h *handler) ListAllRecords(c *fiber.Ctx) error {
	records, err := h.s.ListAllRecords(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(records)
}

func (h *handler) ListForPatient(c *fiber.Ctx) error {
	patientIDStr := c.Params("patientID")
	patientID, err := strconv.ParseInt(patientIDStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid patientID"})
	}

	records, err := h.s.ListForPatient(c.Context(), patientID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(records)
}

func (h *handler) AssignMedicine(c *fiber.Ctx) error {
	var payload struct {
		DoctorID   int64 `json:"doctor_id"`
		PatientID  int64 `json:"patient_id"`
		MedicineID int64 `json:"medicine_id"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid payload"})
	}

	err := h.s.AssignMedicine(c.Context(), payload.DoctorID, payload.PatientID, payload.MedicineID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
