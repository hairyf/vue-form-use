import { isBrowser, isObject, isPlainObject } from './is'

export function deepClone<T>(data: T): T {
  let copy: any
  const isArray = Array.isArray(data)
  const isFileListInstance
    = typeof FileList !== 'undefined' ? data instanceof FileList : false
  if (data instanceof Date) {
    copy = new Date(data)
  }
  else if (
    !(isBrowser() && (data instanceof Blob || isFileListInstance))
    && (isArray || isObject(data))
  ) {
    copy = isArray ? [] : Object.create(Object.getPrototypeOf(data))

    if (!isArray && !isPlainObject(data)) {
      copy = data
    }
    else {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          copy[key] = deepClone(data[key])
        }
      }
    }
  }
  else {
    return data
  }
  return copy
}
