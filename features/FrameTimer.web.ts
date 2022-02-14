import { FPS, FrameTimerProps } from "./FrameTimerCommon";

export default class FrameTimer {
  private interval: number;
  private lastFrameTime: number;
  private onGenerateFrame: () => void;
  private onWriteFrame: () => void;
  private requestID = 0;

  constructor(props: FrameTimerProps) {
    // Run at 60 FPS
    this.onGenerateFrame = props.onGenerateFrame;
    // Run on animation frame
    this.onWriteFrame = props.onWriteFrame;
    this.onAnimationFrame = this.onAnimationFrame.bind(this);
    this.interval = 1e3 / FPS;
    this.lastFrameTime = 0;
  }

  public start() {
    this.requestAnimationFrame();
  }

  public stop() {
    if (this.requestID) window.cancelAnimationFrame(this.requestID);
    this.lastFrameTime = 0;
  }

  private generateFrame() {
    this.onGenerateFrame();
    this.lastFrameTime += this.interval;
  }

  private onAnimationFrame = (time: number) => {
    this.requestAnimationFrame();
    // how many ms after 60fps frame time
    let excess = time % this.interval;

    // newFrameTime is the current time aligned to 60fps intervals.
    // i.e. 16.6, 33.3, etc ...
    let newFrameTime = time - excess;

    // first frame, do nothing
    if (!this.lastFrameTime) {
      this.lastFrameTime = newFrameTime;
      return;
    }

    let numFrames = Math.round(
      (newFrameTime - this.lastFrameTime) / this.interval
    );

    // This can happen a lot on a 144Hz display
    if (numFrames === 0) {
      //console.log("WOAH, no frames");
      return;
    }

    // update display on first frame only
    this.generateFrame();
    this.onWriteFrame();

    // we generate additional frames evenly before the next
    // onAnimationFrame call.
    // additional frames are generated but not displayed
    // until next frame draw
    let timeToNextFrame = this.interval - excess;
    for (let i = 1; i < numFrames; i++) {
      setTimeout(() => {
        this.generateFrame();
      }, (i * timeToNextFrame) / numFrames);
    }
  };

  private requestAnimationFrame() {
    this.requestID = window.requestAnimationFrame(this.onAnimationFrame);
  }
}
