package main

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Exit() {
	runtime.Quit(a.ctx)
}

func (a *App) Calculate(prompt string) []string {
	if prompt == "" {
		return []string{"", ""}
	}
	cmd := exec.Command("qalc", prompt)

	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	// Run the command
	err := cmd.Run()
	if err != nil {
		return []string{"", fmt.Errorf("failed to run qalc: %w", err).Error()}
	}

	output := stdout.String()

	// Split output lines and look for warnings
	var resultLines []string
	var warningLines []string

	lines := strings.Split(output, "\n")
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "warning:") {
			warningLines = append(warningLines, trimmed)
		} else if trimmed != "" {
			resultLines = append(resultLines, trimmed)
		}
	}

	return []string{strings.Join(resultLines, "\n"), strings.Join(warningLines, "\n")}

	// var stdout, stderr bytes.Buffer
	// cmd.Stdout = &stdout
	// cmd.Stderr = &stderr
	// err := cmd.Run()
	// if err != nil {
	// 	return stdout.String(), err.Error()
	// }
	// return stdout.String(), stderr.String()
}
