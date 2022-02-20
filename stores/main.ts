import { atom } from "recoil";

export const hackingAtom = atom<boolean>({
  key: "hacking",
  default: false,
});
