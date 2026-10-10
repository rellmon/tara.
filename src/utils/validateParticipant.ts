const MAX_NAME_LENGTH = 40

// Returns an error message, or undefined when the name is valid.
export function validateParticipantName(
  name: string,
  existingNames: string[],
): string | undefined {
  const trimmed = name.trim()

  if (trimmed === '') {
    return 'Name is required.'
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`
  }

  const lower = trimmed.toLowerCase()
  if (existingNames.some((existing) => existing.trim().toLowerCase() === lower)) {
    return 'Someone on this trip already has that name.'
  }

  return undefined
}