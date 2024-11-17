package server

import (
	"context"
	"fmt"
	"net"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"

	authHandlers "github.com/EgorTarasov/tuladays/auth/handlers"
	authRepo "github.com/EgorTarasov/tuladays/auth/repo"
	authService "github.com/EgorTarasov/tuladays/auth/service"
	chatHandlers "github.com/EgorTarasov/tuladays/chat/handlers"
	chatService "github.com/EgorTarasov/tuladays/chat/service"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	dashboardHandlers "github.com/EgorTarasov/tuladays/dashboard/handlers"
	dashboardRepo "github.com/EgorTarasov/tuladays/dashboard/repo"
	dashboardService "github.com/EgorTarasov/tuladays/dashboard/service"
	"github.com/EgorTarasov/tuladays/pkg/click"
	"github.com/EgorTarasov/tuladays/pkg/pb"
	"github.com/EgorTarasov/tuladays/pkg/postgres"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	recovermw "github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/zerolog/log"
)

type Server interface {
	Serve()
}

type server struct {
	app    *fiber.App
	cfg    *Config
	nodeId string
	pgPool *pgxpool.Pool
}

// inits routes byt providing corresponding services such as auth and so on
func NewServer(cfg *Config) Server {
	if cfg == nil {
		panic("config not provided")
	}
	app := fiber.New(fiber.Config{
		ServerHeader: "tula-hack",
		BodyLimit:    4096,
	})
	nodeID := uuid.NewString()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Join(cfg.Server.Cors, ", "),
		AllowCredentials: true,
	}))

	app.Use(logger.New())
	app.Use(recovermw.New())

	api := app.Group("/api")
	views := app.Group("/")

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString(nodeID)
	})

	pool, err := postgres.InitPostgres(context.Background(), cfg.Pg)
	if err != nil {
		panic(err)
	}
	ch, err := click.InitClick(context.Background(), cfg.Click)
	if err != nil {
		panic(err)
	}

	userRepo := authRepo.NewPgRepo(pool)

	authService := authService.New(userRepo, cfg.Auth.JwtSecret)
	authHandler := authHandlers.NewHandler(authService)

	authHandlers.InitRoutes(api, views, authHandler)

	conn, err := grpc.NewClient(fmt.Sprintf("%s:%d", cfg.Chat.Host, cfg.Chat.Port), grpc.WithTransportCredentials(
		insecure.NewCredentials(),
	))
	if err != nil {
		panic(err)
	}
	client := pb.NewRAGServiceClient(conn)

	chatService := chatService.NewChatService(cfg.Chat, client)
	chatHandler := chatHandlers.NewChatHandlers(chatService)
	chatHandlers.InitRoutes(api, views, chatHandler)

	patientRepo := dashboardRepo.NewPgRepo(pool)
	healthDataRepo := dashboardRepo.NewHealthData(ch)
	medicineRepo := dashboardRepo.NewMedicine(pool)

	dashboardService := dashboardService.New(healthDataRepo, patientRepo, medicineRepo)
	dashboardHandler := dashboardHandlers.NewHandler(dashboardService)
	dashboardHandlers.InitRoutes(api, views, dashboardHandler)

	go chatHandler.HandleMessages()

	return &server{
		app:    app,
		cfg:    cfg,
		nodeId: nodeID,
		pgPool: pool,
	}
}

func (s *server) Serve() {
	defer s.pgPool.Close()
	go func() {
		adr := net.JoinHostPort("0.0.0.0", strconv.FormatInt(int64(s.cfg.Server.Port), 10))
		if err := s.app.Listen(adr); err != nil {
			log.Err(err).Msg("application interrupted")
		}
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)
	<-shutdown

	if err := s.app.Shutdown(); err != nil {
		log.Err(err).Msg("graceful shutdown")
	}

}
