export const INPUT_VALIDATION_RULES = {
  max: 'max',
  min: 'min',
  maxLength: 'maxLength',
  minLength: 'minLength',
  pattern: 'pattern',
  required: 'required',
  validate: 'validate',
}

export const ELEMENT_VALUE_MAP = {
  CHECKBOX: 'checked',
  RADIO: 'checked',
  SELECT: 'value',
}

export const EVENTS = {
  BLUR: 'blur',
  FOCUS_OUT: 'focusout',
  CHANGE: 'change',
} as const

export type ElementMapKey = keyof typeof ELEMENT_EVENT_MAP

export const ELEMENT_EVENT_MAP = {
  CHECKBOX: 'onChange',
  RADIO: 'onChange',
  SELECT: 'onChange',
}
