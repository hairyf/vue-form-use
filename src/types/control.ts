import type { Ref } from 'vue'
import type { DefaultValues } from './default-values'
import type { FieldErrors } from './errors'
import type { FieldName, Fields, InternalFieldName } from './fields'
import type { UseFormProps } from './form'
import type { ClearError, Focus, HandleSubmit, Register, Reset, ResetField, SetError, Trigger, Unregister, Update } from './operate'
import type { FieldPath } from './path'
import type { State } from './state'
import type { FieldValues } from './struct'
import type { Noop } from './utils'

export type GetIsDirty = <Name extends InternalFieldName, Data>(name?: Name, data?: Data) => boolean

export type InternalNameSet = Set<InternalFieldName>
export interface Names {
  mount: InternalNameSet
  unmount: InternalNameSet
  disabled: InternalNameSet
  // array: InternalNameSet
  // watch: InternalNameSet
  // focus?: InternalFieldName
  // watchAll?: boolean
}
export type InternalSetValid = (shouldUpdateValid?: boolean) => void
export type InternalSetErrors<Values extends FieldValues> = (errors: FieldErrors<Values>) => void
export type InternalSetDisabledField = (props: { disabled?: boolean, name: FieldName<any> }) => void
export type InternalRunSchema = (names: InternalFieldName[]) => Promise<{ errors: FieldErrors }>
export type InternalFocusError = () => boolean | undefined
export type InternalDisableForm = (disabled?: boolean) => void
export type InternalRemoveUnmounted = () => void

export interface Control<
  Values extends FieldValues = FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
> {
  // _getDirty: GetIsDirty
  // _setValid: InternalSetValid
  // _setErrors: InternalSetErrors<Values>
  // _setDisabledField: InternalSetDisabledField
  // _focusError: InternalFocusError
  // _disableForm: InternalDisableForm

  _values: Values
  _runSchema: InternalRunSchema
  _resetDefaultValues: Noop

  trigger: Trigger<Values>
  register: Register<Values>
  unregister: Unregister<Values>
  update: Update<Values>
  focus: Focus<Values>
  reset: Reset<Values>
  setError: SetError<Values>
  handleSubmit: HandleSubmit<Values, TransformedValues>
  resetField: ResetField<Values>

  clearError: ClearError<Values>

  defaultValues: Partial<DefaultValues<Values>>
  options: UseFormProps<Values, Context, TransformedValues>
  names: Names
  state: State<Values>
  fields: Fields<Values>
}

export type UseControlContext<
  Values extends FieldValues = FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
> = Partial<{
  _runSchema: () => Promise<{ values: TransformedValues, errors: FieldErrors<Values> }>
  _resetDefaultValues: () => Promise<void>
  _mergeNames: (name?: InternalFieldName | InternalFieldName[]) => FieldPath<Values>[]
  _updateStateErrors: (errors: FieldErrors<Values>) => void
  _focusError: () => void
  _disableForm: (disabled?: boolean) => void
  _removeUnmounted: () => void
  _executeSchemaAndUpdateState: (names?: InternalFieldName[]) => Promise<void>
  _executeBuiltInValidation: (names?: any[], shouldOnlyCheckValid?: boolean) => Promise<boolean>
  onChange: (event: any) => Promise<void>

  context: Context
  values: Ref<Values>
  state: State<Values>
  fields: Fields<Values>
  defaultValues: Ref<DefaultValues<Values>> & { reset: () => void }
  options: UseFormProps<Values, Context, TransformedValues>
  names: Names
  trigger: Trigger<Values>
  register: Register<Values>
  unregister: Unregister<Values>
  update: Update<Values>
  focus: Focus<Values>
  reset: Reset<Values>
  setError: SetError<Values>
  handleSubmit: HandleSubmit<Values, TransformedValues>
  resetField: ResetField<Values>
  clearError: ClearError<Values>
}>
