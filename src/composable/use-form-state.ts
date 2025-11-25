import type { FieldValues, FormState } from '../types'
import { useFormContext } from './use-form-context'

export function useFormState<Values extends FieldValues>(): FormState<Values> {
  return useFormContext<Values>().state.form
}
