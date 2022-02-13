// @ts-ignore
import { Controller } from "jsnes";

// Mapping keyboard code to [controller, button]
const KEYS = {
  88: [1, Controller.BUTTON_A, "X"], // X
  89: [1, Controller.BUTTON_B, "Y"], // Y (Central European keyboard)
  90: [1, Controller.BUTTON_B, "Z"], // Z
  17: [1, Controller.BUTTON_SELECT, "Right Ctrl"], // Right Ctrl
  13: [1, Controller.BUTTON_START, "Enter"], // Enter
  38: [1, Controller.BUTTON_UP, "Up"], // Up
  40: [1, Controller.BUTTON_DOWN, "Down"], // Down
  37: [1, Controller.BUTTON_LEFT, "Left"], // Left
  39: [1, Controller.BUTTON_RIGHT, "Right"], // Right
  103: [2, Controller.BUTTON_A, "Num-7"], // Num-7
  105: [2, Controller.BUTTON_B, "Num-9"], // Num-9
  99: [2, Controller.BUTTON_SELECT, "Num-3"], // Num-3
  97: [2, Controller.BUTTON_START, "Num-1"], // Num-1
  104: [2, Controller.BUTTON_UP, "Num-8"], // Num-8
  98: [2, Controller.BUTTON_DOWN, "Num-2"], // Num-2
  100: [2, Controller.BUTTON_LEFT, "Num-4"], // Num-4
  102: [2, Controller.BUTTON_RIGHT, "Num-6"], // Num-6
};

interface Options {
  onButtonDown: (player: number, key: number) => void;
  onButtonUp: (player: number, key: number) => void;
}

export default class KeyboardController {
  private keys?: { [key: number]: [number, number, string] };
  private onButtonDown: (player: number, key: number) => void;
  private onButtonUp: (player: number, key: number) => void;

  constructor(options: Options) {
    this.onButtonDown = options.onButtonDown;
    this.onButtonUp = options.onButtonUp;
  }

  /*
  setKeys = (newKeys: { [key: number]: [number, number, string] }) => {
    try {
      localStorage.setItem("keys", JSON.stringify(newKeys));
      this.keys = newKeys;
    } catch (e) {
      console.log("Failed to set keys in localStorage");
    }
  };
  */

  public handleKeyDown = (keyCode: number) => {
    if (!this.keys) return;
    const key = this.keys[keyCode];
    if (key) this.onButtonDown(key[0], key[1]);
  };

  public handleKeyUp = (keyCode: number) => {
    if (!this.keys) return;
    const key = this.keys[keyCode];
    if (key) this.onButtonUp(key[0], key[1]);
  };

  public loadKeys = () => {
    var keys;
    try {
      keys = localStorage.getItem("keys");
      if (keys) keys = JSON.parse(keys);
    } catch (e) {
      console.log("Failed to get keys from localStorage.", e);
    }

    this.keys = keys || KEYS;
  };
}
