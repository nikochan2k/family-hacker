import { atom } from "recoil";

export interface Modification {
  address: number;
  value: number;
  name: string;
}

export const modificationAtom = atom<Modification | null>({
  key: "modification",
  default: null,
});

export const modificationsAtom = atom<Modification[]>({
  key: "modifications",
  default: [],
});
