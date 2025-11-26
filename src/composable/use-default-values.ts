import type { Ref } from 'vue'
import type { DefaultValues, UseControlContext } from '../types'
import { extendRef } from '@vueuse/shared'
import { computed, ref } from 'vue'
import { deepClone, resolve } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useDefaultValues(context: UseControlContext) {
  const source = ref<any>({}) as Ref<DefaultValues<any>>
  const values = context.values!
  const state = context.state!
  const props = context.options!

  const computedDefaultValues = computed({
    get: () => source.value,
    set: (value: DefaultValues<any>) => {
      source.value = value
      values.value = deepClone(value)
    },
  })

  function reset(): void {
    resolve(props.defaultValues, {
      onPromiseStart: () => state.isLoading = true,
      onPromiseEnded: () => state.isLoading = false,
      onResolved: result => source.value = result,
    })
  }

  return extendRef(computedDefaultValues, { reset })
}
