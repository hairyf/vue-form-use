import type { ComputedRef, Ref } from 'vue'
import type { DefaultValues, FieldValues } from '../types'
import { computed, ref } from 'vue'
import { deepClone } from '../utils'

export function useDefaultValues<Values extends FieldValues>(values: Ref<Values>): ComputedRef<DefaultValues<Values>> {
  const source = ref({} as unknown as DefaultValues<Values>)
  return computed({
    get: () => source.value,
    set: (value: DefaultValues<Values>) => {
      source.value = value
      values.value = deepClone(value) as Values
    },
  })
}
