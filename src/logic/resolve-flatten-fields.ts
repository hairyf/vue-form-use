import type { Field, FieldValues, InternalFieldName } from '../types'
import type { FieldPath } from '../types/path/eager'

export type FlattenFields<Values extends FieldValues> = Record<InternalFieldName, Field<Values, FieldPath<Values>>>
export function resolveFlattenFields<Values extends FieldValues>(
  names: Set<InternalFieldName> | InternalFieldName[],
  fields: Values,
): FlattenFields<Values> {
  const result: FlattenFields<Values> = {}
  for (const name of names)
    result[name] = fields[name]
  return result
}
