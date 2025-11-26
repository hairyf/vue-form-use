import type { InternalFieldName, Names } from '../types'
import { reactive } from 'vue'

export function useFieldNames(): Names {
  const names = reactive({
    mount: new Set<InternalFieldName>(),
    disabled: new Set<InternalFieldName>(),
    unmount: new Set<InternalFieldName>(),
  })
  return names
}
