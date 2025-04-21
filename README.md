# `Crifo`

Fast rofi-like calculator which uses `qalc` under the hood. Written in `Go`/`Wails` + `React`/`TypeScript`.

## Usage

Simply run the executable

```sh
crifo
```

`Enter` key copies the last output to the clipboard.

![demo-1](./demo/demo-1.webp)

![demo-2](./demo/demo-2.webp)

![demo-3](./demo/demo-3.webp)

![demo-4](./demo/demo-4.webp)

## Building from source

You'll need `qalc`, `wails`, `npm`, and `go`. From the root simply run:

```
wails build -clean -o crifo
```

The executable is then produced in `build/bin`.
