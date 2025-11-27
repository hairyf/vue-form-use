import type { AnyObjectSchema, ValidateOptions, ValidationError } from 'yup'
import type { FieldErrors, FieldPath, FieldValues, Resolver, ResolverResolved } from '../types'
import { set } from '../utils'

async function parseYupSchema<
  Values extends FieldValues,
  TransformedValues extends FieldValues = Values,
>(
  schema: AnyObjectSchema,
  values: Values,
  options: ValidateOptions,
): Promise<ResolverResolved<Values, TransformedValues>> {
  const errors: FieldErrors<Values> = {}
  let nextValues = {} as TransformedValues
  try {
    nextValues = await schema.validate(values, options) as TransformedValues
  }
  catch (errs: unknown) {
    const validationError = errs as ValidationError
    validationError.inner.forEach((err: ValidationError) => {
      set(errors, err.path as FieldPath<Values>, err)
    })
  }

  return {
    values: nextValues,
    errors,
  } as ResolverResolved<Values, TransformedValues>
}

export function yupResolver<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(
  schema: AnyObjectSchema,
  options: ValidateOptions = {},
): Resolver<Values, Context, TransformedValues> {
  return async (
    values: Values,
  ): Promise<ResolverResolved<Values, TransformedValues>> => {
    return parseYupSchema(schema, values, { abortEarly: false, ...options })
  }
}
