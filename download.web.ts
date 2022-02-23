export function download(json: string) {
  const blob = new Blob([json]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.setAttribute("download", "state.json");
  a.click();
}
