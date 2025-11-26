import type { DefaultValues } from './default-values'
import type { FieldError, FieldErrors } from './errors'
import type { FieldElementProps } from './fields'

import type { FieldPath, FieldPathValue } from './path'
import type { KeepStateOptions, ResetAction } from './reset'
import type { FieldValues } from './struct'
import type { RegisterOptions } from './validator'

/**
 * Set an error for the field. When set an error which is not associated to a field then manual `clearErrors` invoke is required.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 * @param error - an error object which contains type and optional message
 * @param options - whether or not to focus on the field
 *
 * @example
 * ```ts
 * // when the error is not associated with any fields, `clearError` will need to invoke to clear the error
 * setError("serverError", { type: "server", message: "Error occurred"})
 *
 * setError("name", { type: "min" })
 *
 * // focus on the input after setting the error
 * setError("name", { type: "max" }, { shouldFocus: true })
 * ```
 */
export interface SetError<Values extends FieldValues> {
  (
    name: FieldPath<Values> | `root.${string}` | 'root',
    error: FieldError,
    options?: { shouldFocus?: boolean }
  ): void
}

/**
 * Clear the entire form errors.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 *
 * @example
 * Clear all errors
 * ```ts
 * clearErrors(); // clear the entire form error
 * clearErrors(["name", "name1"]) // clear an array of fields' error
 * clearErrors("name2"); // clear a single field error
 * ```
 */
export interface ClearError<Values extends FieldValues> {
  (
    name?:
      | FieldPath<Values>
      | FieldPath<Values>[]
      | `root.${string}` | 'root'
  ): void
}

export type ResetFieldConfig<Values extends FieldValues, FieldName extends FieldPath<Values> = FieldPath<Values>> = Partial<{
  keepDirty: boolean
  keepTouched: boolean
  keepError: boolean
  defaultValue: FieldPathValue<Values, FieldName>
}>

/**
 * Set a single field value, or a group of fields value.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 * @param value - field value
 * @param options - should validate or update form state
 *
 * @example
 * ```ts
 * // Update a single field
 * update('name', 'value', {
 *   shouldValidate: true, // trigger validation
 *   shouldTouch: true, // update touched fields form state
 *   shouldDirty: true, // update dirty and dirty fields form state
 * });
 *
 * // Update a group fields
 * update('root', {
 *   a: 'test', // update('root.a', 'data')
 *   b: 'test1', // update('root.b', 'data')
 * });
 *
 * // Update a nested object field
 * update('select', { label: 'test', value: 'Test' });
 * ```
 */
export interface Update<Values extends FieldValues> {
  <FieldName extends FieldPath<Values> = FieldPath<Values>>(
    name: FieldName,
    value: FieldPathValue<Values, FieldName>,
    options?: { shouldDirty?: boolean }
  ): void
}

export interface UpdateOptions<Value> {
  defaultValue?: Value
  shouldValidate?: boolean
  shouldDirty?: boolean
  shouldTouch?: boolean
}

/**
 * Reset a field state and reference.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 * @param options - keep form state options
 *
 * @example
 * ```vue
 * <input v-bind="register('firstName')" />
 * <button type="button" @click="resetField('firstName')">Reset</button>
 * ```
 */
export interface ResetField<Values extends FieldValues> {
  <FieldName extends FieldPath<Values> = FieldPath<Values>>(
    name: FieldName,
    options?: ResetFieldConfig<Values, FieldName>
  ): void
}

/**
 * Reset at the entire form state.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param values - the entire form values to be reset
 * @param keepStateOptions - keep form state options
 *
 * @example
 * ```ts
 * // reset the entire form after component mount or form defaultValues is ready
 * reset({
 *   fieldA: "test"
 *   fieldB: "test"
 * });
 *
 * // reset by combine with existing form values
 * reset({
 *   ...getValues(),
 *  fieldB: "test"
 *});
 *
 * // reset and keep form state
 * reset(
 *   { ...getValues() },
 *   {
 *     keepErrors: true,
 *     keepDirty: true
 *   }
 * );
 * ```
 */
export interface Reset<Values extends FieldValues> {
  (
    values?: DefaultValues<Values> | Values | ResetAction<Values>,
    keepStateOptions?: KeepStateOptions
  ): void
}

export interface SubmitHandler<TransformedValues> {
  (data: TransformedValues, event: any): Promise<void> | void
}

export interface SubmitErrorHandler<Values extends FieldValues> {
  (errors: FieldErrors<Values>, event: any): Promise<unknown>
}

/**
 * Validate the entire form. Handle submit and error callback.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param onValid - callback function invoked after form pass validation
 * @param onInvalid - callback function invoked when form failed validation
 *
 * @returns callback - return callback function
 *
 * @example
 * ```ts
 * const onSubmit = (data) => console.log(data);
 * const onError = (error) => console.log(error);
 *
 * <form @submit="handleSubmit(onSubmit, onError)">
 *   <input v-bind="register('firstName')" />
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 */
export interface HandleSubmit<
  Values extends FieldValues,
  TransformedValues = Values,
> {
  (onValid?: SubmitHandler<TransformedValues>, onInvalid?: SubmitErrorHandler<Values>): (event: any) => Promise<void>
}

export interface UnregisterOptions extends Omit<KeepStateOptions, 'keepIsSubmitted' | 'keepSubmitCount' | 'keepValues' | 'keepDefaultValues' | 'keepErrors'> {
  keepValue?: boolean
  keepDefaultValue?: boolean
  keepError?: boolean
}

/**
 * Unregister a field reference and remove its value.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 * @param options - keep form state options
 *
 * @example
 * ```vue
 * register("name", { required: true })
 *
 * <button @click="unregister('name')">Unregister</button>
 * <!-- there are various keep options to retain formState -->
 * <button @click="unregister('name', { keepErrors: true })">Unregister</button>
 * ```
 */
export interface Unregister<Values extends FieldValues> {
  (
    name: FieldPath<Values>,
    options?: UnregisterOptions
  ): void
}

export interface Register<Values extends FieldValues> {
  <FieldName extends FieldPath<Values> = FieldPath<Values>>(name: FieldName, options?: RegisterOptions<Values, FieldName>): FieldElementProps<Values, FieldName>
}

export type FocusOptions = Partial<{
  shouldSelect: boolean
}>
/**
 * Set focus on a registered field. You can start to invoke this method after all fields are mounted to the DOM.
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - the path name to the form field value.
 * @param options - input focus behavior options
 *
 * @example
 * ```ts
 * focus("name");
 * // shouldSelect allows to select input's content on focus
 * focus("name", { shouldSelect: true })
 * ```
 */
export interface Focus<Values extends FieldValues> {
  (
    name: FieldPath<Values>,
    options?: FocusOptions
  ): void
}

export type TriggerConfig = Partial<{
  shouldFocus: boolean
}>
/**
 * Trigger field or form validation
 *
 * @remarks
 * [API](TODO) • [Demo](TODO) • [Video](TODO)
 *
 * @param name - provide empty argument will trigger the entire form validation, an array of field names will validate an array of fields, and a single field name will only trigger that field's validation.
 * @param options - should focus on the error field
 *
 * @returns validation result
 *
 * @example
 * ```ts
 * const result = await trigger(); // result will be a boolean value
 * ```
 */
export interface Trigger<Values extends FieldValues> {
  (name?: FieldPath<Values> | FieldPath<Values>[], options?: TriggerConfig): Promise<boolean>
}
