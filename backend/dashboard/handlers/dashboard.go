package handlers

import (
	"github.com/EgorTarasov/tuladays/auth/middleware"
	"github.com/EgorTarasov/tuladays/dashboard/service"
	"github.com/gofiber/fiber/v2"
)

type handler struct {
	s service.Service
}

type Handler interface {
	GetDashboardForUser(*fiber.Ctx) error
	GetPatients(*fiber.Ctx) error
	CreateMedicineRecord(*fiber.Ctx) error
	GetMedicineRecord(*fiber.Ctx) error
	ListAllRecords(*fiber.Ctx) error
	ListForPatient(*fiber.Ctx) error
	AssignMedicine(*fiber.Ctx) error
}

func NewHandler(s service.Service) Handler {
	return &handler{s}
}

func InitRoutes(api fiber.Router, view fiber.Router, h Handler) error {
	initApi(api, h)
	return nil
}

func initApi(api fiber.Router, h Handler) error {
	dashboard := api.Group("/dashboard")
	dashboard.Get("/patient/:id", middleware.RoleMiddleware("doctor"), h.GetDashboardForUser)
	dashboard.Get("/patients", middleware.RoleMiddleware("doctor"), h.GetPatients)

	medicine := api.Group("/medicine")
	medicine.Post("/create", middleware.RoleMiddleware("doctor"), h.CreateMedicineRecord)
	medicine.Get("/:id", middleware.RoleMiddleware("doctor"), h.GetMedicineRecord)
	medicine.Get("/", middleware.RoleMiddleware("doctor"), h.ListAllRecords)
	medicine.Get("/patient/:patientID", middleware.RoleMiddleware("doctor"), h.ListForPatient)
	medicine.Post("/assign", middleware.RoleMiddleware("doctor"), h.AssignMedicine)

	return nil
}
