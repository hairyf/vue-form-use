import type { Control } from './control'
import type { ChangeHandler } from './fields'
import type { FieldPath, FieldPathValue } from './path'
import type { State } from './state'
import type { FieldValues } from './struct'
import type { Transformer } from './transformer'

export interface FieldProps<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
> {
  name: Name
  value: FieldPathValue<Values, Name>
  onChange: ChangeHandler
  onBlur: ChangeHandler
  disabled?: boolean
  // ref:
}

export interface UseControllerProps<
  Values extends FieldValues = FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
> {
  control: Control<Values, any, TransformedValues>
  transformer?: Transformer<any, any>
  shouldUnregister?: boolean
  defaultValue?: FieldPathValue<Values, Name>
  disabled?: boolean
  name: Name
}

export type ControllerProps<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
> = UseControllerProps<Values, Name, TransformedValues>

export interface UseControllerReturn<
  Values extends FieldValues = FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
> {
  state: State<Values>
  field: FieldProps<Values, Name>
}
