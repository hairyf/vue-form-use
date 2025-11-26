import type { ElementMapKey } from '../constants'
import type { FieldPath, RegisterOptions, UnregisterOptions, UseControlContext } from '../types'
import { reactiveComputed } from '@vueuse/shared'
import { computed, reactive, ref } from 'vue'
import { ELEMENT_EVENT_MAP, ELEMENT_VALUE_MAP } from '../constants'
import { getRuleValue } from '../logic'
import { get, isBrowser, set, unset } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useFieldRegistry(context: UseControlContext) {
  const fields = context.fields!
  const props = context.options!
  const values = context.values!
  const names = context.names!
  const onChange = context.onChange!
  const state = context.state!
  const defaultValues = context.defaultValues!

  function register(name: FieldPath<any>, options?: RegisterOptions): any {
    const cached = get(fields, name)

    if (cached)
      return cached._p

    const _f = reactive({
      ref: ref(),
      name,
      mount: false,
      refs: {},
      ...options,
    })
    const $props = {
      disabled: options?.disabled || props.disabled,
      ...(props.progressive
        ? {
            required: !!options?.required,
            min: getRuleValue(options?.min),
            max: getRuleValue(options?.max),
            minLength: getRuleValue<number>(options?.minLength) as number,
            maxLength: getRuleValue(options?.maxLength) as number,
            pattern: getRuleValue(options?.pattern) as string,
          }
        : {}),
      name,
      value: computed(() => get(values.value, name)),
      onChange: (event: any) => onChange(Object.assign(event, { name })),
      onBlur: (event: any) => onChange(Object.assign(event, { name })),
      ref: (ref: any, refs: any) => {
        _f.ref = ref
        _f.refs = refs
        _f.mount = true
      },
    }

    const _p = reactiveComputed(() => {
      if (isBrowser() && _f.ref instanceof Element) {
        const TAG_NAME = (Reflect.get(_f.ref, 'type') || _f.ref.tagName).toUpperCase() as ElementMapKey
        return {
          [ELEMENT_VALUE_MAP[TAG_NAME] || 'value']: $props.value,
          [ELEMENT_EVENT_MAP[TAG_NAME] || 'onInput']: $props.onChange,
          ref: $props.ref,
          name,
          onBlur: $props.onBlur,
        }
      }

      if (_f.ref?.controller) {
        return {
          value: $props.value,
          onChange: $props.onChange,
          ref: $props.ref,
          name,
          onBlur: $props.onBlur,
        }
      }

      return {
        'modelValue': $props.value,
        'onUpdate:modelValue': (value: any) => onChange({ target: { value, name } }),
        'ref': $props.ref,
        'name': name,
        'onBlur': $props.onBlur,
      }
    })

    const field = reactive<any>({ _f, _p })

    names.mount.add(name)
    set(fields, name, field)

    return field._p
  }

  function unregister(name: FieldPath<any>, options: UnregisterOptions = {}): void {
    names.mount.delete(name)

    if (!options.keepValue)
      unset(values.value, name)

    !options.keepError && unset(state.fields, `${name}.error`)
    !options.keepDirty && set(state.fields, `${name}.isDirty`, false)
    !options.keepTouched && set(state.fields, `${name}.isTouched`, false)
    !options.keepIsValidating && set(state.fields, `${name}.isValidating`, false)
    !props.shouldUnregister && !options.keepDefaultValue && unset(defaultValues.value, name)
  }

  return { register, unregister }
}
