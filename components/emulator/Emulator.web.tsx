// @ts-ignore
import { NES } from "jsnes";
import React, { PureComponent } from "react";
import FrameTimer from "../../features/FrameTimer";
import KeyboardController from "../../features/KeyboardController";
import { nesMap } from "../../stores/nes";
import { EmulatorProps } from "./EmulatorCommon";
import { Screen } from "./Screen";

export class Emulator extends PureComponent<EmulatorProps> {
  private static index = 0;

  public nes?: NES;
  public key = "";

  private frameTimer?: FrameTimer;
  private keyboardController?: KeyboardController;
  private screen?: Screen;
  private started = false;

  public componentDidMount() {
    if (!this.screen) return;

    // Initial layout
    this.fitInParent();

    this.nes = new NES({
      onFrame: this.screen.setBuffer,
      onStatusUpdate: console.log,
    });
    this.key = Emulator.index.toString(16);
    Emulator.index++;

    this.frameTimer = new FrameTimer({
      onGenerateFrame: () => this.nes.frame(),
      onWriteFrame: () => {
        if (!this.screen) return;
        this.screen.writeBuffer();
      },
    });

    this.keyboardController = new KeyboardController({
      onButtonDown: this.nes.buttonDown,
      onButtonUp: this.nes.buttonUp,
    });

    // Load keys from localStorage (if they exist)
    this.keyboardController.loadKeys();

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("keypress", this.onKeyPress);

    this.nes.loadROM(this.props.romData);
    this.start();
  }

  public componentDidUpdate(prevProps: EmulatorProps) {
    this.start();
  }

  public componentWillUnmount() {
    this.stop();

    // Unbind keyboard
    document.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("keypress", this.onKeyPress);
  }

  public render() {
    return (
      <Screen
        ref={(screen) => {
          if (!screen) return;
          this.screen = screen;
        }}
      />
    );
  }

  public start = () => {
    if (!this.frameTimer || this.started) return;
    this.started = true;
    nesMap[this.key] = this.nes;
    this.frameTimer.start();
  };

  public stop = () => {
    if (!this.frameTimer || !this.started) return;
    this.started = false;
    delete nesMap[this.key];
    this.frameTimer.stop();
  };

  /*
   * Fill parent element with screen. Typically called if parent element changes size.
   */
  private fitInParent() {
    if (!this.screen) return;
    const canvas: HTMLCanvasElement = (this.screen as any).canvas;
    if (!canvas || !canvas.parentElement) return;
    const parent = canvas.parentElement;
    let width = parent.clientWidth;
    let height = parent.clientHeight;

    this.screen.fit(width, height);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keyboardController?.handleKeyDown(e.keyCode);
    e.preventDefault();
  };

  private onKeyPress = (e: KeyboardEvent) => {
    // e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keyboardController?.handleKeyUp(e.keyCode);
    e.preventDefault();
  };
}
