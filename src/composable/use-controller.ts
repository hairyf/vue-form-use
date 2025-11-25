import type { FieldPath, FieldProps, FieldValues, UseControllerProps, UseControllerReturn } from '../types'
import { computed, onUnmounted, reactive, toRef } from 'vue'
import { EVENTS } from '../constants'
import { getEventValue } from '../logic'
import { deepClone, get, isUndefined, set } from '../utils'

export function useController<
  Values extends FieldValues = FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
>(props: UseControllerProps<Values, Name, TransformedValues>): UseControllerReturn<Values, Name> {
  const registerProps = props.control.register(props.name)
  // TODO: rules
  // const registerProps = props.control.register(props.name, {...})
  const shouldUnregisterField = props.control.options.shouldUnregister || props.shouldUnregister

  registerProps.ref({ controller: true })

  function onChange(event: any): void {
    registerProps.onChange({
      target: {
        value: getEventValue(event),
        name: props.name,
      },
      type: EVENTS.CHANGE,
    })
  }
  function onBlur(event: any): void {
    registerProps.onBlur({
      target: {
        value: getEventValue(event),
        name: props.name,
      },
      type: EVENTS.BLUR,
    })
  }
  const field = reactive({
    disabled: computed(() => props.control.state.form.disabled || props.disabled),
    value: toRef(registerProps, 'value'),
    ref: registerProps.ref,
    name: props.name,
    onChange,
    onBlur,
  }) as unknown as FieldProps<Values, Name>

  if (shouldUnregisterField) {
    const value = deepClone(get(props.control.defaultValues, props.name) || props.defaultValue)
    set(props.control.defaultValues, props.name, value)
    if (isUndefined(get(props.control._values, props.name)))
      set(props.control._values, props.name, value)
    onUnmounted(() => {
      props.control.unregister(props.name)
    })
  }

  const controller = reactive({
    state: props.control.state,
    field,
  })

  return controller as UseControllerReturn<Values, Name>
}
