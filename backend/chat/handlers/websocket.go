package handlers

import (
	"strconv"
	"sync"

	authModels "github.com/EgorTarasov/tuladays/auth/models"
	"github.com/EgorTarasov/tuladays/chat/models"
	"github.com/EgorTarasov/tuladays/chat/service"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/rs/zerolog/log"
)

type ChatHandlers interface {
	HandleWebsocket(*websocket.Conn)
	HandleMessages()
}

type handlers struct {
	// userID conn
	clients     map[int64]*websocket.Conn
	clientMutex sync.RWMutex

	chatService service.ChatService
}

func NewChatHandlers(chat service.ChatService) ChatHandlers {
	return &handlers{
		clients:     make(map[int64]*websocket.Conn),
		clientMutex: sync.RWMutex{},
		chatService: chat,
	}
}

func InitRoutes(api fiber.Router, view fiber.Router, h ChatHandlers) error {
	initApi(api, h)
	return nil
}

func initApi(api fiber.Router, h ChatHandlers) error {
	auth := api.Group("/chat")

	auth.Get("/ws/:chatID", websocket.New(h.HandleWebsocket))
	return nil
}

func (h *handlers) HandleWebsocket(c *websocket.Conn) {
	// get authToken from Header

	// authToken := c.Headers("authToken")
	// authToken := c.Query("authToken")
	_, msg, err := c.ReadMessage()
	if err != nil {
		log.Err(err).Msg("chat: unable to read message")
		return
	}

	// authToken := c.Cookies("authToken")
	if msg == nil {
		log.Err(nil).Msg("chat: no authToken")
		return
	}
	token := authModels.AuthToken(string(msg))

	chatIDStr := c.Params("chatID")
	chatID, err := strconv.ParseInt(chatIDStr, 10, 64)
	if err != nil {
		log.Err(err).Msg("chat: unable to parse chatID")
		return
	}

	userData, err := token.Decode()
	if err != nil {
		log.Err(err).Msg("chat: unable to decode token")
	}
	h.clientMutex.Lock()
	h.clients[userData.UserID] = c
	h.clientMutex.Unlock()
	c.Conn.WriteMessage(websocket.TextMessage, []byte("connected"))
	// closing connection on exit
	defer func() {
		h.clientMutex.Lock()
		delete(h.clients, userData.UserID)
		h.clientMutex.Unlock()
	}()
	var message models.Message
	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Err(err).Msg("chat: unable to read message")
			break
		}
		message = models.Message{
			UserID:   userData.UserID,
			Text:     string(msg),
			ChatID:   chatID,
			Metadata: nil,
		}
		h.chatService.HandleMessage(message)
	}
}

// goroutine for sending messages for users
func (h *handlers) HandleMessages() {
	for message := range h.chatService.GetMessageChan() {
		h.clientMutex.RLock()
		conn, ok := h.clients[message.UserID]
		if !ok {
			log.Err(nil).Msg("chat: user not found")
			h.clientMutex.RUnlock()
			continue
		}
		err := conn.WriteMessage(websocket.TextMessage, []byte(message.Text))
		if err != nil {
			log.Err(err).Msg("chat: unable to send message")
		}
		h.clientMutex.RUnlock()
	}
}
