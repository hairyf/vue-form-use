import type { ValidationRule, ValidationValue, ValidationValueMessage } from '../types'
import { isObject, isRegex } from '../utils'

export function getValueAndMessage(validationData?: ValidationRule): ValidationValueMessage {
  return isObject(validationData) && !isRegex(validationData)
    ? validationData
    : {
        value: validationData as ValidationValue,
        message: '',
      }
}
