import type { FieldPath, FieldValues } from '../types'

/**
 * Delete nested value from object by path string
 */
export function unset<Values extends FieldValues, ValueName extends FieldPath<Values>>(obj: Values, path: ValueName): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let current: any = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return
    }
    current = current[key]
  }
  if (current != null && typeof current === 'object') {
    delete current[lastKey]
  }
}
