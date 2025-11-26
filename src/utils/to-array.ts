export function toArray<T>(value?: T | T[] | Set<T>): T[] {
  if (!value)
    return []
  if (value instanceof Set)
    return Array.from(value)
  return Array.isArray(value) ? value : [value]
}
