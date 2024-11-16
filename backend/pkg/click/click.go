package click

import (
	"context"
	"database/sql"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
)

func InitClick(ctx context.Context, cfg *Config) (*sql.DB, error) {
	conn := clickhouse.OpenDB(&clickhouse.Options{
		Protocol: clickhouse.Native,
		TLS:      nil,
		Addr:     cfg.GetAddr(),
		Auth:     cfg.GetAuth(),
	})
	conn.SetMaxIdleConns(5)
	conn.SetMaxOpenConns(10)
	conn.SetConnMaxLifetime(time.Hour)

	// Check connection
	if err := conn.Ping(); err != nil {
		return nil, err
	}

	return conn, nil
}
