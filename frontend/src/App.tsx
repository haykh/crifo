import { useEffect, useRef, useReducer } from "react";
import { TbMathIntegral } from "react-icons/tb";
import { ClipboardSetText } from "../wailsjs/runtime";

import { Calculate, Exit } from "../wailsjs/go/main/App";
import "./App.css";

interface StateProps {
  prompt: string;
  stdout: string;
  stderr: string;
}

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 20);
    };

    const inputElement = inputRef.current;
    inputElement?.addEventListener("blur", handleBlur);

    return () => {
      inputElement?.removeEventListener("blur", handleBlur);
    };
  }, []);

  const [state, dispatch] = useReducer(
    (
      state: StateProps,
      action: {
        type: string;
        payload?: any;
      },
    ) => {
      if (action.type === "select") {
        ClipboardSetText(state.stdout).then((status: boolean) => {
          if (status) {
            dispatch({
              type: "update",
              payload: {
                stderr: state.stderr
                  ? state.stderr.replace("(copied)", "") + " (copied)"
                  : "(copied)",
              },
            });
          }
        });
      } else if (action.type === "update") {
        return {
          ...state,
          stdout:
            action.payload.stdout !== undefined
              ? action.payload.stdout
              : state.stdout,
          stderr:
            action.payload.stderr !== undefined
              ? action.payload.stderr
              : state.stderr,
        };
      } else if (action.type === "escape") {
        Exit();
        return state;
      }
      return state;
    },
    {
      prompt: "",
      stdout: "",
      stderr: "",
    },
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch({ type: "escape" });
      } else if (e.key === "Enter") {
        dispatch({ type: "select" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  return (
    <div id="App">
      <div id="input" className="input-box">
        <TbMathIntegral />
        <input
          placeholder="calc"
          id="name"
          className="input"
          onChange={(e: any) =>
            Calculate(e.target.value).then((response) => {
              dispatch({
                type: "update",
                payload: { stdout: response[0], stderr: response[1] },
              });
            })
          }
          autoComplete="off"
          name="input"
          type="text"
          ref={inputRef}
          autoFocus
        />
      </div>

      <div id="output" className="output-box">
        <p>{state.stdout}</p>
        <p className="error">{state.stderr}</p>
      </div>
    </div>
  );
}

export default App;
