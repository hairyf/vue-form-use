import type { Ref } from 'vue'
import type { ElementMapKey } from '../constants'
import type {
  Control,
  DefaultValues,
  FieldError,
  FieldErrors,
  FieldPath,
  FieldPathValue,
  Fields,
  FieldState,
  FieldValues,
  FocusOptions,
  InternalFieldName,
  KeepStateOptions,
  RegisterOptions,
  ResetAction,
  ResetFieldConfig,
  ResolverOptions,
  State,
  SubmitErrorHandler,
  SubmitHandler,
  TriggerConfig,
  UnregisterOptions,
  UpdateOptions,
  UseFormProps,
} from '../types'
import { reactiveComputed } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import { ELEMENT_EVENT_MAP, ELEMENT_VALUE_MAP } from '../constants'
import { getRuleValue, resolveFlattenFields, validateField } from '../logic'
import { deepClone, get, isAsyncFunction, isBrowser, isElement, resolve, set, toArray, unset } from '../utils'
import { useDefaultValues } from './use-default-values'

export function useControl<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(
  props: UseFormProps<Values, Context, TransformedValues>,
  values: Ref<Values>,
  state: State<Values>,
  names: Set<InternalFieldName>,
): Control<Values, Context, TransformedValues> {
  const context = reactive(props.context || {} as any)
  const defaultValues = useDefaultValues(values)
  const fields = reactive({} as Fields<Values>)

  function _mergeNames(name?: InternalFieldName | InternalFieldName[]): FieldPath<Values>[] {
    return (toArray(name) || Array.from(names)) as FieldPath<Values>[]
  }

  async function _resetDefaultValues(): Promise<void> {
    resolve(props.defaultValues, {
      onPromiseStart: () => state.form.isLoading = true,
      onPromiseEnded: () => state.form.isLoading = false,
      onResolved: (result: any) => defaultValues.value = result,
    })
  }

  async function _runSchema(name?: InternalFieldName[]): Promise<{ values: Values, errors: FieldErrors<Values> }> {
    set(state.fields, `${name}.isValidating`, true)
    const names = _mergeNames(name)
    const options: ResolverOptions<Values> = {
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
      values: deepClone(result?.values || values.value) as Values,
      errors: (result?.errors || {}) as unknown as FieldErrors<Values>,
    }
  }

  function _updateStateErrors(errors: FieldErrors<Values>): void {
    for (const name of names) {
      const error = get(errors, name)
      error
        ? set(state.fields, `${name}.error`, error)
        : unset(state.fields, `${name}.error`)
      set(state.fields, `${name}.isTouched`, true)
      set(state.fields, `${name}.invalid`, !!error)
    }
  }

  async function _executeSchemaAndUpdateState(names?: InternalFieldName[]): Promise<void> {
    names = _mergeNames(names)

    const { errors } = await _runSchema(names)

    _updateStateErrors(errors)
  }

  function _focusError(): void {
    if (!props.shouldFocusError)
      return
    for (const name of names) {
      if (!get(state.form.errors, name))
        continue
      focus(name as FieldPath<Values>)
    }
  }

  async function onChange(event: any): Promise<void> {
    const nextValue = event?.target?.value ?? event?.target?.checked ?? event
    const fieldName = event?.name ?? event?.target?.name
    const fieldState = get(state.fields, fieldName) as FieldState
    const isBlurEvent = event?.type === 'blur' || event?.type === 'focusout'

    const shouldRevalidate = fieldState.isTouched && props.reValidateMode === 'onChange'
    const shouldTrigger = props.mode === 'onChange' || (props.mode === 'onBlur' && isBlurEvent) || shouldRevalidate

    fieldState.isDirty = nextValue !== get(defaultValues.value, fieldName)

    set(values.value, fieldName, nextValue)
    shouldTrigger && trigger(fieldName)
  }

  async function trigger(name?: FieldPath<Values> | FieldPath<Values>[], options?: TriggerConfig): Promise<boolean> {
    const names = _mergeNames(name)

    if (props.resolver) {
      await _executeSchemaAndUpdateState(names)
    }
    else {
      await executeBuiltInValidation(names)
      _updateStateErrors(state.form.errors)
    }

    if (options?.shouldFocus)
      _focusError()

    return state.form.isValid
  }

  function focus(name: FieldPath<Values>, options?: FocusOptions): void {
    const field = get(fields, name)
    const ref = field?._f.ref
    if (!ref)
      return
    options?.shouldSelect ? ref.select?.() : ref.focus?.()
  }

  function register(name: FieldPath<Values>, options?: RegisterOptions): any {
    const cachedField = get(fields, name)

    if (cachedField)
      return cachedField._p

    const _f = reactive({
      ref: ref(),
      name,
      mount: false,
      refs: {},
      ...options,
    })
    const $props = {
      disabled: options?.disabled || props.disabled,
      ...(props.progressive
        ? {
            required: !!options?.required,
            min: getRuleValue(options?.min),
            max: getRuleValue(options?.max),
            minLength: getRuleValue<number>(options?.minLength) as number,
            maxLength: getRuleValue(options?.maxLength) as number,
            pattern: getRuleValue(options?.pattern) as string,
          }
        : {}),
      name,
      value: computed(() => get(values.value, name)),
      onChange: (event: any) => onChange(Object.assign(event, { name })),
      onBlur: (event: any) => onChange(Object.assign(event, { name })),
      ref: (ref: any, refs: any) => {
        _f.ref = ref
        _f.refs = refs
        _f.mount = true
      },
    }

    const _p = reactiveComputed(() => {
      if (isBrowser() && _f.ref instanceof Element) {
        const TAG_NAME = (Reflect.get(_f.ref, 'type') || _f.ref.tagName).toUpperCase() as ElementMapKey
        return {
          [ELEMENT_VALUE_MAP[TAG_NAME] || 'value']: $props.value,
          [ELEMENT_EVENT_MAP[TAG_NAME] || 'onInput']: $props.onChange,
          ref: $props.ref,
          name,
          onBlur: $props.onBlur,
        }
      }

      if (_f.ref?.controller) {
        return {
          value: $props.value,
          onChange: $props.onChange,
          ref: $props.ref,
          name,
          onBlur: $props.onBlur,
        }
      }

      return {
        'modelValue': $props.value,
        'onUpdate:modelValue': $props.onChange,
        'ref': $props.ref,
        'name': name,
        'onBlur': $props.onBlur,
      }
    })

    const field = reactive<any>({ _f, _p })

    names.add(name)
    set(fields, name, field)

    return field._p
  }

  function unregister(name: FieldPath<Values>, options: UnregisterOptions = {}): void {
    names.delete(name)

    if (!options.keepValue)
      unset(values.value, name)

    !options.keepError && unset(state.fields, `${name}.error`)
    !options.keepDirty && set(state.fields, `${name}.isDirty`, false)
    !options.keepTouched && set(state.fields, `${name}.isTouched`, false)
    !options.keepIsValidating && set(state.fields, `${name}.isValidating`, false)
    !props.shouldUnregister && !options.keepDefaultValue && unset(defaultValues.value, name)
  }

  function update<FieldName extends FieldPath<Values> = FieldPath<Values>>(
    name: FieldName,
    value: FieldPathValue<Values, FieldName>,
    options?: UpdateOptions<FieldPathValue<Values, FieldName>>,
  ): void {
    set(values.value, name, value)
    options?.shouldDirty && set(state.fields, `${name}.isDirty`, true)
    options?.shouldTouch && set(state.fields, `${name}.isTouched`, true)
    options?.shouldValidate && trigger(name)
  }

  function reset(
    _values?: DefaultValues<Values> | Values | ResetAction<Values>,
    options?: KeepStateOptions,
  ): void {
    const resolved = resolve(_values, { args: [values.value] })
    const nextValues = deepClone(resolved || defaultValues.value)

    if (!options?.keepDefaultValues)
      defaultValues.value = nextValues as unknown as DefaultValues<Values>

    if (!options?.keepValues) {
      if (options?.keepDirtyValues) {
        for (const name of names) {
          get(state.form.dirtyFields, name)
            ? set(nextValues, name, get(values.value, name))
            : set(values.value, name, get(nextValues, name))
        }
      }
      else {
        if (isBrowser() && !_values) {
          for (const name of names) {
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
      : nextValues) as Values

    for (const name of names) {
      const fieldState = get(fields, name)!
      set(state.fields, name, {
        isValidating: options?.keepIsValidating ? fieldState.isValidating : false,
        isValid: options?.keepIsValid ? fieldState.isValid : false,
        isDirty: options?.keepDirty ? fieldState.isDirty : false,
        isTouched: options?.keepTouched ? fieldState.isTouched : false,
        error: options?.keepErrors ? fieldState.error : undefined,
      })
    }

    Object.assign(state.form, {
      isSubmitted: options?.keepIsSubmitted ? state.form.isSubmitted : false,
      isSubmitSuccessful: options?.keepIsSubmitSuccessful ? state.form.isSubmitSuccessful : false,
      submitCount: options?.keepSubmitCount ? state.form.submitCount : 0,
    })
  }

  function resetField<FieldName extends FieldPath<Values> = FieldPath<Values>>(name: FieldName, options?: ResetFieldConfig<FieldPathValue<Values, FieldName>>): void {
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

  function setError(name: FieldPath<Values> | `root.${string}` | 'root', error: FieldError, options?: { shouldFocus?: boolean }): void {
    const ref = get(fields, name)?._f?.ref
    set(state.form.errors, name, error)
    options?.shouldFocus && ref.focus?.()
  }
  function clearError(name?: FieldPath<Values> | FieldPath<Values>[] | `root.${string}` | 'root'): void {
    for (const _name of _mergeNames(name))
      unset(state.form.errors, _name)
  }

  function handleSubmit(
    onValid: SubmitHandler<TransformedValues>,
    onInvalid?: SubmitErrorHandler<Values>,
  ): (e: any) => Promise<void> {
    return async (e: any) => {
      let onValidError

      if (e) {
        e.preventDefault?.()
        e.persist?.()
      }

      let fieldValues

      state.form.isSubmitting = true

      if (props.resolver) {
        const { values, errors } = await _runSchema()
        _updateStateErrors(errors)
        fieldValues = values
      }
      else {
        await executeBuiltInValidation()
        _updateStateErrors(state.form.errors)
        fieldValues = values.value
      }

      fieldValues = deepClone(fieldValues)

      // TODO: Disable fields
      // if (names.disabled.size) {
      //   for (const name of names.disabled) {
      //     unset(values, name);
      //   }
      // }

      unset(state.form.errors, 'root')

      if (state.form.isValid) {
        try {
          await onValid(fieldValues as unknown as TransformedValues, e)
        }
        catch (error) {
          onValidError = error
        }
      }
      else {
        if (onInvalid)
          await onInvalid({ ...state.form.errors }, e)
        _focusError()
        setTimeout(_focusError)
      }

      state.form.isSubmitting = false
      state.form.isSubmitted = true
      state.form.isSubmitSuccessful = state.form.isValid
      state.form.submitCount++

      if (onValidError)
        throw onValidError
    }
  }

  async function executeBuiltInValidation(names: FieldPath<Values>[] = _mergeNames(), shouldOnlyCheckValid?: boolean): Promise<boolean> {
    const context = { valid: true }

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
        context.valid = false
        if (shouldOnlyCheckValid)
          break
      }

      set(state.fields, `${name}.error`, fieldError[name])
    }
    return context.valid
  }

  const control = {
    _values: values,
    _runSchema,
    _resetDefaultValues,

    defaultValues,
    state,
    fields,

    trigger,
    register,
    unregister,
    update,
    focus,

    reset,
    setError,
    clearError,
    handleSubmit,
    resetField,

    names,
    options: props,
  }

  return reactive(control) as Control<Values, Context, TransformedValues>
}
