import { atom } from "recoil";

export type ExprType =
  | "*"
  | "="
  | "≠"
  | ">"
  | "≧"
  | "<"
  | "≦"
  | "+"
  | "-"
  | "≠?"
  | ">?"
  | "<?";

export interface Condition {
  expr: ExprType;
  value: number;
}

export interface Byte {
  address: number;
  value: number;
}

export interface Snapshot {
  bytes: Byte[];
  ticks: number;
  condition: Condition;
}

export const snapshotsAtom = atom<Snapshot[]>({
  key: "snapshots",
  default: [],
});

export const addSnapshot = (
  cond: Condition,
  snapshots: Snapshot[],
  mem: number[]
) => {
  let filter: ((v: number, p: number) => boolean) | undefined;
  switch (cond.expr) {
    case "*":
      filter = () => true;
      break;
    case "=":
      filter = (v: number) => v === cond.value;
      break;
    case "≠":
      filter = (v: number) => v !== cond.value;
      break;
    case ">":
      filter = (v: number) => v > cond.value;
      break;
    case "≧":
      filter = (v: number) => v >= cond.value;
      break;
    case "<":
      filter = (v: number) => v < cond.value;
      break;
    case "≦":
      filter = (v: number) => v <= cond.value;
      break;
    case "+":
      filter = (v: number, p: number) => v == p + cond.value;
      break;
    case "-":
      filter = (v: number, p: number) => v == p - cond.value;
      break;
    case "≠?":
      filter = (v: number, p: number) => v !== p;
      break;
    case ">?":
      filter = (v: number, p: number) => v > p;
      break;
    case "<?":
      filter = (v: number, p: number) => v < p;
      break;
    default:
      return snapshots;
  }
  const snapshot: Snapshot = {
    bytes: [],
    condition: cond,
    ticks: Date.now(),
  };
  if (snapshots.length === 0) {
    let address = 0;
    for (const v of mem as number[]) {
      if (filter(v, 0)) {
        snapshot.bytes.push({ address, value: v });
      }
      address++;
      if (0x0800 <= address) {
        break;
      }
    }
  } else {
    const previous = snapshots[snapshots.length - 1];
    for (const { address, value: p } of previous.bytes) {
      const v = mem[address];
      if (filter(v, p)) {
        snapshot.bytes.push({ address, value: v });
      }
      if (0x0800 <= address) {
        break;
      }
    }
  }
  return [...snapshots, snapshot];
};
