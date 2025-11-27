import type { AsyncValidationOptions, Schema, ValidationError } from 'joi'
import type { FieldError, FieldValues, ResolverOptions, ResolverResolved } from '../types'

function parseErrorSchema(error: ValidationError, _validateAllFieldCriteria: boolean): Record<string, FieldError> {
  return error.details.length
    ? error.details.reduce<Record<string, FieldError>>((previous, error) => {
        const _path = error.path.join('.')
        if (!previous[_path]) {
          previous[_path] = { message: error.message, type: error.type }
        }

        // TODO: Implement validateAllFieldCriteria
        // if (validateAllFieldCriteria) {
        //   // const types = previous[_path].types
        //   // const messages = types && types[error.type!]
        //   previous[_path] = appendErrors(
        //     _path,
        //     validateAllFieldCriteria,
        //     previous,
        //     error.type,
        //     error.message,
        //   ) as any as FieldError
        // }

        return previous
      }, {})
    : {}
}

export type JoiResolver = <T extends Schema>(
  schema: T,
  schemaOptions?: AsyncValidationOptions,
  factoryOptions?: { mode?: 'async' | 'sync' },
) => <TFieldValues extends FieldValues, TContext>(
  values: TFieldValues,
  context: TContext | undefined,
  options: ResolverOptions<TFieldValues>,
) => Promise<ResolverResolved<TFieldValues>>
/**
 * Creates a resolver for react-hook-form using Joi schema validation
 * @param {Joi.ObjectSchema<TFieldValues>} schema - The Joi schema to validate against
 * @param {Joi.ValidationOptions} [schemaOptions] - Optional Joi validation options
 * @param {object} resolverOptions - Additional resolver configuration
 * @param {string} [resolverOptions.mode] - Validation mode
 * @returns {Resolver<TFieldValues>} A resolver function compatible with react-hook-form
 * @example
 * const schema = Joi.object({
 *   name: Joi.string().required(),
 *   age: Joi.number().required()
 * });
 *
 * useForm({
 *   resolver: joiResolver(schema)
 * });
 */
export const joiResolver: JoiResolver
  = (
    schema,
    schemaOptions = {
      abortEarly: false,
    },
    resolverOptions = {},
  ) =>
    async (values, context, options) => {
      const _schemaOptions = Object.assign({}, schemaOptions, {
        context,
      })

      let result: Record<string, any> = {}
      if (resolverOptions.mode === 'sync') {
        result = schema.validate(values, _schemaOptions)
      }
      else {
        try {
          result.value = await schema.validateAsync(values, _schemaOptions)
        }
        catch (e) {
          result.error = e
        }
      }

      if (result.error) {
        return {
          values: {},
          errors: parseErrorSchema(
            result.error,
            !options.shouldUseNativeValidation
            && options.criteriaMode === 'all',
          ),
        }
      }

      return { errors: {}, values: result.value } as any
    }
