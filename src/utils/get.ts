import type { FieldValues } from '../types'

/**
 * Get nested value from object by path string
 */
export function get<
  Values extends FieldValues,
>(
  obj: Values,
  path: string,
): any | undefined {
  const keys = path.split('.')
  let result: any = obj
  for (const key of keys) {
    if (result == null)
      return undefined
    result = result[key]
  }
  return result
}
