import type { Control } from './control'
import type { AsyncDefaultValues, DefaultValues } from './default-values'

import type { FieldErrors } from './errors'
import type { CriteriaMode, Mode, RevalidateMode } from './mode'
import type {
  ClearError,
  Focus,
  HandleSubmit,
  Register,
  Reset,
  ResetField,
  SetError,
  Trigger,
  Unregister,
  Update,
} from './operate'
import type { KeepStateOptions } from './reset'
import type { Resolver } from './resolver'
import type { State } from './state'
import type { FieldValues } from './struct'

export interface UseFormProps<
  Values extends FieldValues = FieldValues,
  Context = any,
  TransformedValues extends FieldValues = FieldValues,
> {
  mode?: Mode
  disabled?: boolean
  reValidateMode?: RevalidateMode
  defaultValues?: DefaultValues<Values> | AsyncDefaultValues<Values>

  values?: Values
  errors?: FieldErrors<Values>
  resetOptions?: KeepStateOptions
  resolver?: Resolver<Values, Context, TransformedValues>

  context?: Context

  shouldFocusError?: boolean
  shouldUnregister?: boolean
  shouldUseNativeValidation?: boolean
  progressive?: boolean
  criteriaMode?: CriteriaMode
  delayError?: number
}

export interface UseFormReturn<
  Values extends FieldValues = FieldValues,
  Context = any,
  TransformedValues extends FieldValues = FieldValues,
> {
  control: Control<Values, Context, TransformedValues>

  values: Values
  update: Update<Values>
  errors: FieldErrors<Values>
  state: State<Values>

  trigger: Trigger<Values>

  resetField: ResetField<Values>
  reset: Reset<Values>

  handleSubmit: HandleSubmit<Values, TransformedValues>

  setError: SetError<Values>
  clearError: ClearError<Values>

  register: Register<Values>
  unregister: Unregister<Values>

  focus: Focus<Values>
}

export type UseFormContext = Partial<UseFormReturn>
