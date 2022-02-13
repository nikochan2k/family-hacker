export const FPS = 60.098;

export interface FrameTimerProps {
  onGenerateFrame: () => void;
  onWriteFrame: () => void;
}
