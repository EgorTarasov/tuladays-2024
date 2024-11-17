package server

import (
	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/dashboard"
	"github.com/EgorTarasov/tuladays/pkg/click"
	"github.com/EgorTarasov/tuladays/pkg/postgres"
	"github.com/ilyakaznacheev/cleanenv"
)

type ServerConfig struct {
	Port int      `yaml:"port"`
	Host string   `yaml:"host"`
	Cors []string `yaml:"cors"`
}

type Config struct {
	Pg        *postgres.Config  `yaml:"pg"`
	Click     *click.Config     `yaml:"click"`
	Server    *ServerConfig     `yaml:"server"`
	Auth      *auth.Config      `yaml:"auth"`
	Dashboard *dashboard.Config `yaml:"dashboard"`
}

func NewConfig(configFilePath string) *Config {
	var cfg Config

	err := cleanenv.ReadConfig(configFilePath, &cfg)
	if err != nil {
		panic(err)
	}

	return &cfg
}
