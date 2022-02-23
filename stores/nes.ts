import { atom } from "recoil";
// @ts-ignore
import { NES } from "jsnes";

export const nesMap: { [key: string]: NES } = {};

export const nesKeyAtom = atom<string>({
  key: "nesKey",
  default: "",
});
