import { reactiveComputed } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import { useFieldRegistry } from '../src/composable/use-field-registry'

describe('useFieldRegistry', () => {
  it('reactiveComputed should work', () => {
    const state = reactive({
      count: 0,
    })

    const computedCount = reactiveComputed(() => {
      return {
        foo: 'bar',
        count: state.count,
      }
    })

    expect(computedCount.foo).toBe('bar')
    expect(computedCount.count).toBe(0)
  })

  it('useFieldRegistry should work', () => {
    const values = reactive<any>({})
    const fields = reactive<any>({})
    const names = reactive({
      mount: new Set(),
    })
    const { register } = useFieldRegistry({
      fields,
      options: {},
      values,
      names,
      onChange: () => {},
      state: reactive({}),
      defaultValues: reactive({}),
    } as any)

    const props = register('username')

    expect(names.mount.has('username')).toBe(true)
    expect(fields.username).toBeDefined()
    expect(values.username).toBeUndefined()

    expect(props.name).toBe('username')
    expect(props.onBlur).toBeDefined()
    expect(props['onUpdate:modelValue']).toBeDefined()
  })
})
