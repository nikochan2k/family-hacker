// @ts-ignore
import { NES } from "jsnes";
export interface EmulatorProps {
  romData: string;
}

export const nesMap: { [key: string]: NES } = {};
