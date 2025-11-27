import type { FieldErrors } from './errors'
import type { Field } from './fields'
import type { CriteriaMode } from './mode'
import type { FieldPath } from './path'
import type { FieldValues } from './struct'

export interface ResolverSuccess<TransformedValues> {
  values: TransformedValues
  errors: Record<string, never>
}
export interface ResolverError<Values extends FieldValues = FieldValues> {
  values: Record<string, never>
  errors: FieldErrors<Values>
}

export type ResolverResolved<Values extends FieldValues = FieldValues, TransformedValues extends FieldValues = Values> = ResolverSuccess<TransformedValues> | ResolverError<Values>

export interface ResolverOptions<Values extends FieldValues = FieldValues> {
  criteriaMode?: CriteriaMode
  fields: Record<FieldPath<Values>, Field<Values, FieldPath<Values>>>
  names: FieldPath<Values>[]
  shouldUseNativeValidation: boolean | undefined
}

export interface Resolver<
  Values extends FieldValues = FieldValues,
  Context = any,
  TransformedValues extends FieldValues = FieldValues,
> {
  (
    fields: Values,
    context: Context | undefined,
    options: ResolverOptions<Values>
  ): Promise<
    ResolverResolved<Values, TransformedValues> | ResolverResolved<Values, TransformedValues>
  > | (ResolverResolved<Values, TransformedValues> | ResolverResolved<Values, TransformedValues>)
}
