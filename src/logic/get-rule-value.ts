import type {
  ValidationRule,
  ValidationValue,
  ValidationValueMessage,
} from '../types'
import { isObject, isRegex, isUndefined } from '../utils'

export function getRuleValue<T extends ValidationValue>(rule?: ValidationRule<T> | ValidationValueMessage<T>): ValidationValue | string | undefined {
  return isUndefined(rule)
    ? rule
    : isRegex(rule)
      ? rule.source
      : isObject(rule)
        ? isRegex(rule.value)
          ? rule.value.source
          : rule.value
        : rule
}
