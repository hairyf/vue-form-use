import type { UseControlContext } from '../types'
import { get, set } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useFieldEvent(context: UseControlContext) {
  const state = context.state!
  const props = context.options!
  const defaultValues = context.defaultValues!
  const values = context.values!

  async function onChange(event: any): Promise<void> {
    const nextValue = event?.target?.value ?? event?.target?.checked ?? event
    const fieldName = event?.name ?? event?.target?.name
    const fieldState = get(state.fields, fieldName)
    const isBlurEvent = event?.type === 'blur' || event?.type === 'focusout'

    const shouldRevalidate = fieldState.isTouched && props.reValidateMode === 'onChange'

    const shouldTrigger = props.mode === 'onChange' || (props.mode === 'onBlur' && isBlurEvent) || shouldRevalidate

    fieldState.isDirty = nextValue !== get(defaultValues.value, fieldName)

    set(values.value, fieldName, nextValue)
    shouldTrigger && context.trigger?.(fieldName)
  }

  return { onChange }
}
