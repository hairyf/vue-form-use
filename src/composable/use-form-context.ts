import type { FieldValues, UseFormReturn } from '../types'
import { inject } from 'vue'
import { formInjectionKey } from '../constants'

export function useFormContext<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(): UseFormReturn<Values, Context, TransformedValues> {
  return inject(formInjectionKey) as UseFormReturn<Values, Context, TransformedValues>
}
