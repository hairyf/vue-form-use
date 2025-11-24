import type { FieldPath, FieldPathValue, FieldValues } from '../types'

/**
 * Set nested value in object by path string
 */
export function set<Values extends FieldValues, ValueName extends FieldPath<Values>>(
  obj: Values,
  path: ValueName,
  value: FieldPathValue<Values, ValueName>,
): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  let current: any = obj
  for (const key of keys) {
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  current[lastKey] = value
}
