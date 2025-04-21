package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	if err := wails.Run(&options.App{
		Title:  "crifo",
		Width:  1024,
		Height: 200,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		Frameless:        true,
		BackgroundColour: &options.RGBA{R: 23, G: 23, B: 23, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	}); err != nil {
		println("Error:", err.Error())
	}
}
