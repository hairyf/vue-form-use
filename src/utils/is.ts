import type { AnyFn } from '@vueuse/shared'

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
  return value instanceof Element
}
