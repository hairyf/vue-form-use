import type { FieldValues } from './struct'

export type KeepStateOptions = Partial<{
  keepDirtyValues: boolean
  keepErrors: boolean
  keepDirty: boolean
  keepValues: boolean
  keepDefaultValues: boolean
  keepIsSubmitted: boolean
  keepIsSubmitSuccessful: boolean
  keepTouched: boolean
  keepIsValidating: boolean
  keepIsValid: boolean
  keepSubmitCount: boolean
}>

export type ResetAction<Values extends FieldValues> = (formValues: Values) => Values
