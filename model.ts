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
