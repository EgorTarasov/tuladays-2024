package handlers

import (
	"github.com/EgorTarasov/tuladays/auth/service"
	"github.com/gofiber/fiber/v2"
)

type handler struct {
	s service.Service
}

type Handler interface {
	RegisterWithEmail(*fiber.Ctx) error
	LoginWithEmail(*fiber.Ctx) error
}

func NewHandler(s service.Service) Handler {
	return &handler{
		s: s,
	}
}

func InitRoutes(api fiber.Router, view fiber.Router, h Handler) error {
	initApi(api, h)
	return nil
}

func initApi(api fiber.Router, h Handler) error {
	auth := api.Group("/auth")

	auth.Post("/signup", h.RegisterWithEmail)
	auth.Post("/login", h.LoginWithEmail)
	return nil
}
