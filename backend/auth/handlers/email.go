package handlers

import (
	"github.com/EgorTarasov/tuladays/auth/models"
	"github.com/gofiber/fiber/v2"
	"github.com/rs/zerolog/log"
)

type emailPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *handler) RegisterWithEmail(c *fiber.Ctx) error {
	var payload emailPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(fiber.StatusUnprocessableEntity)
	}

	token, err := h.s.CreateEmailAccount(c.Context(), models.CreateUser{
		Email:    payload.Email,
		Password: payload.Password,
	})
	if err != nil {
		log.Err(err).Interface("data", payload).Msg("unable to create account for")
		return c.SendStatus(fiber.StatusBadRequest)
	}
	return c.JSON(fiber.Map{"access_token": token, "type": "Bearer"})
}

type emailLoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *handler) LoginWithEmail(c *fiber.Ctx) error {
	var payload emailLoginPayload

	if err := c.BodyParser(&payload); err != nil {
		return c.SendStatus(fiber.StatusUnprocessableEntity)
	}

	token, err := h.s.AuthWithEmail(c.Context(), models.LoginData{
		Email:    payload.Email,
		Password: payload.Password,
	})
	if err != nil {
		log.Err(err).Interface("data", payload).Msg("unable to create account for")
		return c.SendStatus(fiber.StatusBadRequest)
	}
	return c.JSON(fiber.Map{"access_token": token, "type": "Bearer"})
}

func (h *handler) MeEndpoint(c *fiber.Ctx) error {
	user := c.Locals("userData").(models.UserData)
	return c.JSON(user)
}
