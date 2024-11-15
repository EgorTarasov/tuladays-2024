package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/chat/models"
)

type ChatService interface {
	HandleMessage(message models.Message)
	GetMessageChan() <-chan models.Message
}

type service struct {
	messageChan chan models.Message
}

func (s *service) CreateChat(ctx context.Context, userID int64) error {
	return nil
}

func (s *service) HandleMessage(message models.Message) {
	// TODO: add multi user logic
	s.messageChan <- message
}

func (s *service) GetMessageChan() <-chan models.Message {
	return s.messageChan
}

func NewChatService() ChatService {
	return &service{
		messageChan: make(chan models.Message),
	}
}
