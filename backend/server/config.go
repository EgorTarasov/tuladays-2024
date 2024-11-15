package server

import (
	"github.com/EgorTarasov/tuladays/auth"
	"github.com/EgorTarasov/tuladays/pkg/postgres"
	"github.com/ilyakaznacheev/cleanenv"
)

type ServerConfig struct {
	Port int      `yaml:"port"`
	Host string   `yaml:"host"`
	Cors []string `yaml:"cors"`
}

type Config struct {
	Pg     *postgres.Config `yaml:"pg"`
	Server *ServerConfig    `yaml:"server"`
	Auth   *auth.Config     `yaml:"auth"`
}

func NewConfig(configFilePath string) *Config {
	var cfg Config

	err := cleanenv.ReadConfig(configFilePath, &cfg)
	if err != nil {
		panic(err)
	}

	return &cfg
}
