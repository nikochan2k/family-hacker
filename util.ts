export function deepCopy<T>(obj: T): T {
  if (obj == null) {
    return obj;
  }

  const str = JSON.stringify(obj);
  return JSON.parse(str);
}

export function toHex(value: number, zeroPaddings?: number) {
  if (typeof value !== "number") {
    return "";
  }
  const hex = value.toString(16).toUpperCase();
  if (zeroPaddings == null) {
    return hex;
  }
  return hex.padStart(zeroPaddings, "0");
}
