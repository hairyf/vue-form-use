import type { ComponentPublicInstance } from 'vue'
import type { FieldError, ValidateResult } from '../types'
import { isBoolean, isString } from '../utils'

export function getValidateError(
  result: ValidateResult,
  ref: Element | ComponentPublicInstance | { controller?: true } | null,
  type = 'validate',
): FieldError | void {
  if (
    isString(result)
    || (Array.isArray(result) && result.every(isString))
    || (isBoolean(result) && !result)
  ) {
    return {
      type,
      message: isString(result) ? result : '',
      ref,
    }
  }
}
