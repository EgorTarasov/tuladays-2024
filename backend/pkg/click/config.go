package click

import (
	"fmt"

	"github.com/ClickHouse/clickhouse-go/v2"
)

type Config struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	Username string `yaml:"username"`
	Password string `yaml:"password"`
	Database string `yaml:"db"`
}

func (c Config) GetAddr() []string {
	return []string{
		fmt.Sprintf("%s:%d", c.Host, c.Port),
	}
}

func (c Config) GetAuth() clickhouse.Auth {
	return clickhouse.Auth{
		Database: c.Database,
		Username: c.Username,
		Password: c.Password,
	}
}
