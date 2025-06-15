export function generateIndentation(count: number, size: number = 2) {
  if (count < 1 || size < 1) return "";
  return Array(count * size).fill(" ").join("");
}
