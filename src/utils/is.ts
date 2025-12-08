import type { AnyFn } from '@vueuse/shared'
import type { ComponentPublicInstance } from 'vue'

export function isFunction(value: any): value is AnyFn {
  return typeof value === 'function'
}
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object'
}

export function isPlainObject(value: any): value is object {
  return isObject(value) && !Array.isArray(value)
}

export function isWeb(): boolean {
  return typeof window !== 'undefined'
}

export function isUndefined(value: any): value is undefined {
  return value === undefined
}

export function isElement(value: any): value is Element {
  return isBrowser() && value instanceof Element
}

export function isRegex(value: any): value is RegExp {
  return value instanceof RegExp
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isRadioInput(value: any): value is HTMLInputElement {
  return isBrowser() && value instanceof HTMLInputElement && value.type === 'radio'
}

export function isCheckBoxInput(value: any): value is HTMLInputElement {
  return isBrowser() && value instanceof HTMLInputElement && value.type === 'checkbox'
}

export function isFileInput(value: any): value is HTMLInputElement {
  return isBrowser() && value instanceof HTMLInputElement && value.type === 'file'
}

export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined
}

export function isEmpty(value: any): boolean {
  return isObject(value) && !Object.keys(value).length
}

export function isAsyncFunction(value: any): value is (...args: any[]) => Promise<any> {
  return isFunction(value) && value.constructor.name === 'AsyncFunction'
}

export function isComponentRef(value: any): value is ComponentPublicInstance {
  return isObject(value) && '__v_skip' in value
}

export function isElementRef(value: any): value is Element {
  return isBrowser() && isElement(value)
}
