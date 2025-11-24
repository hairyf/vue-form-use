import type { AnyFn } from '@vueuse/shared'
import { isFunction } from './is'

export interface ResolveOptions<T> {
  args?: T extends AnyFn ? Parameters<T> : never
  onPromiseStart?: () => void
  onPromiseEnded?: () => void
  onResolved?: (result: T extends AnyFn ? Awaited<ReturnType<T>> : T) => void
  onRejected?: (reason: any) => void
}

export function resolve<T>(value: T | AnyFn, options?: ResolveOptions<T>): T extends AnyFn ? ReturnType<T> : T {
  let result
  if (isFunction(value)) {
    result = value(...(options?.args || []))
    if (result instanceof Promise) {
      options?.onPromiseStart?.()
      result.finally(options?.onPromiseEnded)
      result.then(options?.onResolved)
      result.catch(options?.onRejected)
    }
    else {
      options?.onResolved?.(result)
    }
  }
  else {
    options?.onResolved?.(value as T extends AnyFn ? Awaited<ReturnType<T>> : T)
  }
  return result
}
