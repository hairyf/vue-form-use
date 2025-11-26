import type { Ref } from 'vue'
import type {
  Control,
  Fields,
  FieldValues,
  UseControlContext,
  UseFormProps,
} from '../types'
import { reactive } from 'vue'

import { useDefaultValues } from './use-default-values'
import { useFieldEvent } from './use-field-event'
import { useFieldNames } from './use-field-names'
import { useFieldRegistry } from './use-field-registry'
import { useFormOperate } from './use-form-operate'
import { useFormSubmit } from './use-form-submit'
import { useFormValidation } from './use-form-validation'
import { useState } from './use-state'

export function useControl<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(
  props: UseFormProps<Values, Context, TransformedValues>,
  values: Ref<Values>,
): Control<Values, Context, TransformedValues> {
  const names = useFieldNames()
  const state = useState(props, names)

  const context: UseControlContext = {
    fields: reactive({} as Fields<Values>),
    context: reactive<any>(props.context || {}),
    names: useFieldNames(),
    options: props as UseFormProps,
    values,
    state,
  }

  const defaultValues = useDefaultValues(context)
  context.defaultValues = defaultValues

  const validation = useFormValidation(context)
  context.trigger = validation.trigger
  context._executeSchemaAndUpdateState = validation._executeSchemaAndUpdateState
  context._executeBuiltInValidation = validation._executeBuiltInValidation
  context._runSchema = validation._runSchema
  context._updateStateErrors = validation._updateStateErrors
  context._focusError = validation._focusError

  const operate = useFormOperate(context)
  context.update = operate.update
  context.focus = operate.focus
  context.reset = operate.reset
  context.resetField = operate.resetField
  context.setError = operate.setError
  context.clearError = operate.clearError

  const event = useFieldEvent(context)
  context.onChange = event.onChange

  const register = useFieldRegistry(context)
  context.register = register.register
  context.unregister = register.unregister

  const submit = useFormSubmit(context)
  context.handleSubmit = submit.handleSubmit

  const control = {
    _values: values,
    _runSchema: validation._runSchema,
    _resetDefaultValues: defaultValues.reset,

    defaultValues,
    state,
    fields: context.fields as any,

    trigger: validation.trigger,
    register: register.register,
    unregister: register.unregister,
    update: operate.update,
    focus: operate.focus,

    reset: operate.reset,
    setError: operate.setError,
    clearError: operate.clearError,
    resetField: operate.resetField,

    handleSubmit: submit.handleSubmit,
    names,
    options: props,
  }

  return reactive(control) as Control<Values, Context, TransformedValues>
}
