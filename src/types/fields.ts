import type { ComponentPublicInstance } from 'vue'
import type { FieldPath, FieldPathValue } from './path'
import type { FieldValues } from './struct'
import type { DeepMap, IsFlatObject, Noop } from './utils'

export type InternalFieldName = string
export type FieldName<Values extends FieldValues> = IsFlatObject<Values> extends true ? Extract<keyof Values, string> : string
export interface FieldEvent { target: any, type?: any }
export type ChangeHandler = (event: FieldEvent) => Promise<void | boolean>

export type CustomElement<Values extends FieldValues> = Partial<HTMLElement> & {
  name: FieldName<Values>
  type?: string
  value?: any
  disabled?: boolean
  checked?: boolean
  options?: HTMLOptionsCollection
  files?: FileList | null
  focus?: Noop
}
export type FieldValue<Values extends FieldValues> = Values[InternalFieldName]
export type NativeFieldValue = string | number | boolean | null | undefined | unknown[]

export type FieldElement<Values extends FieldValues = FieldValues> = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | CustomElement<Values>

export interface FieldElementProps<Values extends FieldValues, FieldName extends FieldPath<Values>> {
  ref: (ref: Element | ComponentPublicInstance | null, refs: Record<string, any>) => void
  value: FieldPathValue<Values, FieldName>
  onChange: ChangeHandler
  onBlur: ChangeHandler
  name: FieldPath<Values>
  disabled: boolean
  max: number | undefined
  maxLength: number | undefined
  min: number | undefined
  minLength: number | undefined
  pattern: string | undefined
  required: boolean | undefined
}

export interface FieldRef<Values extends FieldValues, FieldName extends FieldPath<Values>> {
  ref?: FieldElement<Values>
  name: FieldName
  refs?: Record<string, any>
  mount?: boolean
}

export interface Field<Values extends FieldValues, FieldName extends FieldPath<Values>> {
  _p: FieldElementProps<Values, FieldName>
  _f: FieldRef<Values, FieldName>
}

export type Fields<Values extends FieldValues> = DeepMap<Values, Field<Values, FieldPath<Values>>>
