package service

import (
	"context"

	"github.com/EgorTarasov/tuladays/chat"
	"github.com/EgorTarasov/tuladays/chat/models"
	"github.com/EgorTarasov/tuladays/pkg/pb"
	"github.com/rs/zerolog/log"
)

type ChatService interface {
	HandleMessage(message models.Message)
	GetMessageChan() <-chan models.Message
}

type service struct {
	messageChan chan models.Message
	rag         pb.RAGServiceClient
}

func (s *service) CreateChat(ctx context.Context, userID int64) error {
	return nil
}

func (s *service) HandleMessage(message models.Message) {

	stream, err := s.rag.StreamQuery(context.Background(), &pb.StreamQueryRequest{
		Query: message.Text,
	})
	if err != nil {
		log.Err(err).Msg("failed to stream query")
		return
	}
	go func() {
		for {
			resp, err := stream.Recv()
			if err != nil {
				break
			}
			s.messageChan <- models.Message{
				Text:   resp.Content,
				UserID: message.UserID,
			}
		}
	}()
}

func (s *service) GetMessageChan() <-chan models.Message {
	return s.messageChan
}

func NewChatService(cfg *chat.Config, client pb.RAGServiceClient) ChatService {
	if cfg == nil {
		panic("config not provided")
	}

	return &service{
		messageChan: make(chan models.Message),
		rag:         client,
	}
}
