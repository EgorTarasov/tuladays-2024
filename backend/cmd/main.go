package main

import (
	"flag"
	"fmt"

	"github.com/EgorTarasov/tuladays/server"
	"github.com/rs/zerolog/log"
)

func main() {

	configPath := flag.String("config", "config.yaml", "path to config file")
	flag.Parse()
	log.Info().Str("configPath", *configPath).Msg("loading config")
	cfg := server.NewConfig(*configPath)
	fmt.Println(cfg)
	srv := server.NewServer(cfg)
	srv.Serve()

}
