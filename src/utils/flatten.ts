import type { FieldValues } from '../types'

export function flatten(obj: FieldValues): FieldValues {
  const output: FieldValues = {}

  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const nested = flatten(obj[key])

      for (const nestedKey of Object.keys(nested)) {
        output[`${key}.${nestedKey}`] = nested[nestedKey]
      }
    }
    else {
      output[key] = obj[key]
    }
  }

  return output
}
