export const capitalize = (string: string): string =>
  string.charAt(0).toUpperCase() + string.slice(1);

export function is_ascii_alphanumeric(text: string) {
  return !/[^a-zA-Z0-9]/.test(text);
}
