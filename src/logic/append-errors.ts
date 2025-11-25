import type {
  InternalFieldErrors,
  InternalFieldName,
  ValidateResult,
} from '../types'

export function appendErrors(name: InternalFieldName, validateAllFieldCriteria: boolean, errors: InternalFieldErrors, type: string, message: ValidateResult): InternalFieldErrors {
  if (validateAllFieldCriteria) {
    return {
      ...errors[name],
      type,
      message: message || true,
    } as any
  }
  return {}
}
