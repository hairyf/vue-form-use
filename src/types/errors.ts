import type { Ref } from 'vue'
import type { FieldValues } from './struct'
import type { BrowserNativeObject, DeepRequired, IsAny, Merge } from './utils'

export type Message = string

export type GlobalError = Partial<{ type: string | number, message: Message }>
export interface FieldError {
  type: string
  root?: FieldError
  ref?: Ref
  message?: Message
}

export type FieldErrorsImplement<T extends FieldValues = FieldValues> = {
  [K in keyof T]?: T[K] extends BrowserNativeObject | Blob ? FieldError : K extends 'root' | `root.${string}` ? GlobalError : T[K] extends object ? Merge<FieldError, FieldErrorsImplement<T[K]>> : FieldError;
}

export type FieldErrors<T extends FieldValues = FieldValues>
  = Partial<
    T extends IsAny<T>
      ? any
      : FieldErrorsImplement<DeepRequired<T>>
  >
  & { root?: Record<string, GlobalError> & GlobalError }
