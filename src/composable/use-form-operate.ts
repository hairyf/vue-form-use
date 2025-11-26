import type { DefaultValues, FieldError, FieldPath, FieldPathValue, FocusOptions, KeepStateOptions, ResetAction, ResetFieldConfig, UpdateOptions, UseControlContext } from '../types'
import { deepClone, get, isBrowser, isElement, resolve, set, toArray, unset } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useFormOperate(context: UseControlContext) {
  const fields = context.fields!
  const props = context.options!
  const defaultValues = context.defaultValues!
  const values = context.values!
  const names = context.names!
  const trigger = context.trigger!
  const state = context.state!

  function focus(name: FieldPath<any>, options?: FocusOptions): void {
    const field = get(fields, name)
    const ref = field?._f.ref
    if (!ref)
      return
    options?.shouldSelect ? ref.select?.() : ref.focus?.()
  }

  function update(
    name: FieldPath<any>,
    value: FieldPathValue<any, FieldPath<any>>,
    options?: UpdateOptions<FieldPathValue<any, FieldPath<any>>>,
  ): void {
    set(values.value, name, value)
    options?.shouldDirty && set(state.fields, `${name}.isDirty`, true)
    options?.shouldTouch && set(state.fields, `${name}.isTouched`, true)
    options?.shouldValidate && trigger(name)
  }

  function reset(
    _values?: DefaultValues<any> | Record<string, any> | ResetAction<any>,
    options?: KeepStateOptions,
  ): void {
    const resolved = resolve(_values, { args: [values.value] })
    const nextValues = deepClone(resolved || defaultValues.value)

    if (!options?.keepDefaultValues)
      defaultValues.value = nextValues

    if (!options?.keepValues) {
      if (options?.keepDirtyValues) {
        for (const name of names.mount) {
          get(state.dirtyFields, name)
            ? set(nextValues, name, get(values.value, name))
            : set(values.value, name, get(nextValues, name))
        }
      }
      else {
        if (isBrowser() && !_values) {
          for (const name of names.mount) {
            const ref = get(fields, `${name}._f.ref`)
            if (isElement(ref)) {
              const form = ref.closest('form')
              if (form) {
                form.reset()
                break
              }
            }
          }
        }
      }
    }

    values.value = (props.shouldUnregister
      ? options?.keepDefaultValues
        ? deepClone(defaultValues.value)
        : {}
      : nextValues)

    for (const name of names.mount) {
      const fieldState = get(fields, name)!
      set(state.fields, name, {
        isValidating: options?.keepIsValidating ? fieldState.isValidating : false,
        isValid: options?.keepIsValid ? fieldState.isValid : false,
        isDirty: options?.keepDirty ? fieldState.isDirty : false,
        isTouched: options?.keepTouched ? fieldState.isTouched : false,
        error: options?.keepErrors ? fieldState.error : undefined,
      })
    }

    Object.assign(state, {
      isSubmitted: options?.keepIsSubmitted ? state.isSubmitted : false,
      isSubmitSuccessful: options?.keepIsSubmitSuccessful ? state.isSubmitSuccessful : false,
      submitCount: options?.keepSubmitCount ? state.submitCount : 0,
    })
  }

  function resetField(name: FieldPath<any>, options?: ResetFieldConfig<FieldPathValue<any, any>>): void {
    if (!get(fields, name))
      return
    if (options?.defaultValue) {
      set(values.value, name, options.defaultValue)
      set(defaultValues.value, name, options.defaultValue)
    }
    else {
      set(values.value, name, get(defaultValues.value, name))
    }

    if (!options?.keepDirty)
      unset(state.fields, `${name}.isDirty`)
    if (!options?.keepTouched)
      unset(state.fields, `${name}.isTouched`)
    if (!options?.keepError)
      unset(state.fields, `${name}.error`)
  }

  function setError(name: FieldPath<any> | `root.${string}` | 'root', error: FieldError, options?: { shouldFocus?: boolean }): void {
    const ref = get(fields, name)?._f?.ref
    set(state.errors, name, error)
    options?.shouldFocus && ref.focus?.()
  }

  function clearError(name?: FieldPath<any> | FieldPath<any>[] | `root.${string}` | 'root'): void {
    for (const name_ of toArray(name || names.mount))
      unset(state.errors, name_)
  }

  return { focus, update, reset, resetField, setError, clearError }
}
