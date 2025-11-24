import type { FieldPath, FieldPathValue, FieldValues } from '../types'

/**
 * Get nested value from object by path string
 */
export function get<
  Values extends FieldValues,
  ValueName extends FieldPath<Values>,
>(
  obj: Values,
  path: ValueName,
): FieldPathValue<Values, ValueName> | undefined {
  const keys = path.split('.')
  let result: any = obj
  for (const key of keys) {
    if (result == null)
      return undefined
    result = result[key]
  }
  return result
}
