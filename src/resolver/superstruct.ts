import type { Infer, Struct, StructError } from 'superstruct'
import type { FieldError, FieldValues, Resolver, ResolverError, ResolverSuccess } from '../types'

import { validate } from 'superstruct'

function parseErrorSchema(error: StructError): Record<string, FieldError> {
  return error.failures().reduce<Record<string, FieldError>>(
    (previous, error) =>
      (previous[error.path.join('.')] = {
        message: error.message,
        type: error.type,
      }) && previous,
    {},
  )
}

export function superstructResolver<Input extends FieldValues, Context>(
  schema: Struct<Input, any>,
  schemaOptions?: Parameters<typeof validate>[2],
  resolverOptions?: {
    raw?: false
  },
): Resolver<Input, Context, Infer<typeof schema>>

export function superstructResolver<Input extends FieldValues, Context, Output extends FieldValues>(
  schema: Struct<Input, any>,
  schemaOptions: Parameters<typeof validate>[2] | undefined,
  resolverOptions: {
    raw: true
  },
): Resolver<Input, Context, Output>

/**
 * Creates a resolver for react-hook-form using Superstruct schema validation
 * @param {Struct<TFieldValues, any>} schema - The Superstruct schema to validate against
 * @param {Parameters<typeof validate>[2]} [schemaOptions] - Optional Superstruct validation options
 * @param {object} resolverOptions - Additional resolver configuration
 * @param {boolean} [resolverOptions.raw] - If true, returns raw values rather than validated results
 * @returns {Resolver<Infer<typeof schema>>} A resolver function compatible with react-hook-form
 * @example
 * const schema = struct({
 *   name: string(),
 *   age: number()
 * });
 *
 * useForm({
 *   resolver: superstructResolver(schema)
 * });
 */
export function superstructResolver<Input extends FieldValues, Context, Output extends FieldValues>(
  schema: Struct<Input, any>,
  schemaOptions?: Parameters<typeof validate>[2],
  resolverOptions: {
    raw?: boolean
  } = {},
): Resolver<Input, Context, Input | Output> {
  return (values: Input, _, _options) => {
    const result = validate(values, schema, schemaOptions)

    if (result[0]) {
      return {
        values: {},
        errors: parseErrorSchema(result[0]),
      } as ResolverError<Input>
    }

    // TODO: Implement validateFieldsNatively
    // options.shouldUseNativeValidation && validateFieldsNatively({}, options)

    return {
      values: resolverOptions.raw ? Object.assign({}, values) : result[1],
      errors: {},
    } as unknown as ResolverSuccess<Output>
  }
}
