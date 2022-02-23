import React, { PureComponent } from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./ScreenCommon";

export class Screen extends PureComponent {
  private buf32?: Uint32Array;
  private buf8?: Uint8ClampedArray;
  private canvas?: HTMLCanvasElement;
  private context2d?: CanvasRenderingContext2D;
  private imageData?: ImageData;

  public componentDidMount() {
    this.initCanvas();
  }

  public componentDidUpdate() {
    this.initCanvas();
  }

  public fit(width: number, height: number) {
    if (!this.canvas) return;
    let ratio = width / height;
    let desiredRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
    if (desiredRatio < ratio) {
      this.canvas.style.width = `${Math.round(height * desiredRatio)}px`;
      this.canvas.style.height = `${height}px`;
    } else {
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${Math.round(width / desiredRatio)}px`;
    }
  }

  public render() {
    return (
      <canvas
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        ref={(canvas) => {
          if (canvas) this.canvas = canvas;
        }}
      />
    );
  }

  public screenshot() {
    if (!this.canvas) return;
    const img = new Image();
    img.src = this.canvas.toDataURL("image/png");
    return img;
  }

  public setBuffer = (buf32: Uint32Array) => {
    if (!this.buf32) return;
    let i = 0;
    for (let y = 0; y < SCREEN_HEIGHT; ++y) {
      for (let x = 0; x < SCREEN_WIDTH; ++x) {
        i = y * 256 + x;
        // Convert pixel from NES BGR to canvas ABGR
        this.buf32[i] = 0xff000000 | buf32[i]; // Full alpha
      }
    }
  };

  public writeBuffer = () => {
    if (!this.imageData || !this.buf8 || !this.context2d) return;
    this.imageData.data.set(this.buf8);
    this.context2d.putImageData(this.imageData, 0, 0);
  };

  private initCanvas() {
    if (!this.canvas) return;
    this.context2d = this.canvas.getContext("2d") || undefined;
    if (!this.context2d) return;
    this.imageData = this.context2d.getImageData(
      0,
      0,
      SCREEN_WIDTH,
      SCREEN_HEIGHT
    );

    this.context2d.fillStyle = "black";
    // set alpha to opaque
    this.context2d.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // buffer to write on next animation frame
    const buf = new ArrayBuffer(this.imageData.data.length);
    // Get the canvas buffer in 8bit and 32bit
    this.buf8 = new Uint8ClampedArray(buf);
    this.buf32 = new Uint32Array(buf);

    // Set alpha
    for (let i = 0; i < this.buf32.length; ++i) {
      this.buf32[i] = 0xff000000;
    }
  }
}
