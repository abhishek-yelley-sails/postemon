export function isValidEmail(value: string) {
  return value && value.includes('@');
}
export function isValidText(value: string, minLength = 1) {
  return value && value.trim().length >= minLength;
}