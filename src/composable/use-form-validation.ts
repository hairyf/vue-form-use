import type { FieldErrors, FieldPath, FieldValues, InternalFieldName, ResolverOptions, TriggerConfig, UseControlContext } from '../types'
import { resolveFlattenFields, validateField } from '../logic'
import { deepClone, get, isAsyncFunction, set, toArray, unset } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useFormValidation(context: UseControlContext) {
  const state = context.state!
  const fields = context.fields!
  const props = context.options!
  const values = context.values!

  async function _runSchema(name?: InternalFieldName[]): Promise<{ values: FieldValues, errors: FieldErrors }> {
    set(state.fields, `${name}.isValidating`, true)
    const names = toArray(name || context.names?.mount)
    const options: ResolverOptions = {
      names,
      fields: resolveFlattenFields(names, fields) as any,
      shouldUseNativeValidation: props.shouldUseNativeValidation,
      criteriaMode: props.criteriaMode,
    }
    const result = await props.resolver?.(
      values.value,
      context,
      options,
    )
    set(state.fields, `${name}.isValidating`, false)
    return {
      values: deepClone(result?.values || values.value),
      errors: (result?.errors || {}),
    }
  }

  function _updateStateErrors(errors: FieldErrors): void {
    for (const name of context.names?.mount || []) {
      const error = get(errors, name)
      error
        ? set(state.fields, `${name}.error`, error)
        : unset(state.fields, `${name}.error`)
      set(state.fields, `${name}.isTouched`, true)
      set(state.fields, `${name}.invalid`, !!error)
    }
  }

  async function _executeSchemaAndUpdateState(names?: InternalFieldName[]): Promise<void> {
    const { errors } = await _runSchema(toArray(names || context.names?.mount))
    _updateStateErrors(errors)
  }

  async function _executeBuiltInValidation(names?: FieldPath<any>[], shouldOnlyCheckValid?: boolean): Promise<boolean> {
    const validationContext = { valid: true }
    names = toArray(names || context.names?.mount)

    for (const name of names) {
      const field = get(fields, name)
      if (!field?._f)
        continue

      if (field?._f.deps)
        await trigger(field?._f.deps)

      const isPromiseFunction = isAsyncFunction(field?._f.validate) || Object.values(field?._f.validate || {}).some(isAsyncFunction)
      if (isPromiseFunction)
        set(state.fields, `${name}.isValidating`, true)

      const fieldError = await validateField(
        field,
        field._p.disabled,
        values.value,
        props.criteriaMode === 'all',
        props.shouldUseNativeValidation && !shouldOnlyCheckValid,
      )

      if (isPromiseFunction)
        set(state.fields, `${name}.isValidating`, false)

      if (fieldError[name]) {
        validationContext.valid = false
        if (shouldOnlyCheckValid)
          break
      }

      set(state.fields, `${name}.error`, fieldError[name])
    }
    return validationContext.valid
  }

  async function trigger(name?: FieldPath<any> | FieldPath<any>[], options?: TriggerConfig): Promise<boolean> {
    const names = toArray(name || context.names?.mount)

    if (props.resolver) {
      await _executeSchemaAndUpdateState(names)
    }
    else {
      await _executeBuiltInValidation(names)
      _updateStateErrors(state.errors)
    }

    if (options?.shouldFocus)
      _focusError()

    return state.isValid
  }

  function _focusError(): void {
    if (!props.shouldFocusError)
      return
    for (const name of (context.names?.mount || [])) {
      if (get(state.fields, `${name}.error`)) {
        context.focus?.(name)
        break
      }
    }
  }

  return {
    _runSchema,
    _updateStateErrors,
    _executeSchemaAndUpdateState,
    _executeBuiltInValidation,
    _focusError,
    trigger,

  }
}
