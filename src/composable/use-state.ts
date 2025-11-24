import type { FieldError, FieldErrors, FieldState, FieldValues, FormState, InternalFieldName, State, UseFormProps } from '../types'
import { computed, reactive, ref } from 'vue'
import { deepMap, get, isFunction } from '../utils'

export function useState<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(
  props: UseFormProps<Values, Context, TransformedValues>,
  names: Set<InternalFieldName>,
): State<Values> {
  const root = ref({})
  const state = reactive({
    fields: {} as any,
    form: {
      isLoading: isFunction(props.defaultValues),
      isSubmitted: false,
      isSubmitting: false,
      isSubmitSuccessful: false,
      submitCount: 0,

      isValidating: computed(() => {
        for (const name of names) {
          if (get(state.fields, `${name}.isValidating`))
            return true
        }
        return false
      }),
      isDirty: computed((): FormState['isDirty'] => {
        for (const name of names) {
          if (get(state.fields, `${name}.isDirty`))
            return true
        }
        return false
      }),
      isValid: computed((): FormState['isValid'] => {
        for (const name of names) {
          if (get(state.fields, `${name}.invalid`))
            return false
        }
        return true
      }),
      dirtyFields: computed((): FormState['dirtyFields'] => {
        return deepMap(state.fields, field => Reflect.get(field || {}, 'isDirty'))
      }),
      touchedFields: computed((): FormState['touchedFields'] => {
        return deepMap(state.fields, field => Reflect.get(field || {}, 'isTouched'))
      }),
      validatingFields: computed((): FormState['validatingFields'] => {
        return deepMap(state.fields, field => Reflect.get(field || {}, 'isValidating'))
      }),
      errors: computed((): FieldErrors<Values> => {
        return reactive({
          root,
          ...deepMap(state.fields, field => computed({
            set: (value: FieldError) => Reflect.set(field, 'error', value),
            get: () => Reflect.get(field || {}, 'error'),
          })),
        }) as FieldErrors<Values>
      }),
      disabled: props.disabled || false,
      isReady: false,
      defaultValues: isFunction(props.defaultValues)
        ? undefined
        : props.defaultValues,
    },
  })

  const resolvedValues = { ...props.defaultValues, ...props.values }
  state.fields = deepMap<Values, FieldState>(resolvedValues as Values, () => {
    return {
      invalid: false,
      isDirty: false,
      isTouched: false,
      isValidating: false,
      error: undefined,
    }
  })

  return state as State<Values>
}
