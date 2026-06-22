const MIN_LENGTH = 12

export function validatePassword(password: string): string | null {
  if (!password || password.length < MIN_LENGTH) {
    return `A jelszónak legalább ${MIN_LENGTH} karakter hosszúnak kell lennie.`
  }
  if (!/[a-z]/.test(password)) {
    return "A jelszónak tartalmaznia kell kisbetűt."
  }
  if (!/[A-Z]/.test(password)) {
    return "A jelszónak tartalmaznia kell nagybetűt."
  }
  if (!/[0-9]/.test(password)) {
    return "A jelszónak tartalmaznia kell számot."
  }
  return null
}

export const PASSWORD_MIN_LENGTH = MIN_LENGTH
