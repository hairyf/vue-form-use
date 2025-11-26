import type {
  FieldValues,
  UseFormProps,
  UseFormReturn,
} from '../types'
import { reactive, ref } from 'vue'
import { deepClone } from '../utils'
import { useControl } from './use-control'

/**
 * Custom hook to manage the entire form.
 *
 * @remarks
 * [API](-) • [Demo](-) • [Video](-)
 *
 * @param props - form configuration and validation parameters.
 *
 * @returns methods - individual functions to manage the form state. {@link Form}
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * function App() {
 *   const { register, handleSubmit, watch, state, values } = useForm();
 * </script>
 *
 * <template>
 *   <form @submit="handleSubmit(onSubmit)">
 *     <input v-bind="register('example')" />
 *     <input v-bind="register('exampleRequired', { required: true })" />
 *     <button type="submit">Submit</button>
 *   </form>
 * </template>
 * ```
 */
export function useForm<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(props: UseFormProps<Values, Context, TransformedValues>): UseFormReturn<Values, Context, TransformedValues> {
  props = {
    ...props,
    mode: props.mode || 'onSubmit',
    reValidateMode: props.reValidateMode || 'onChange',
    shouldUnregister: props.shouldUnregister ?? false,
    shouldFocusError: props.shouldFocusError ?? true,
  }

  const values = ref<Values>(deepClone(props.values || {}) as unknown as Values)

  const control = useControl(props, values)

  control._resetDefaultValues()

  const form: UseFormReturn<Values, Context, TransformedValues> = {
    values: values as Values,
    control,
    state: control.state,
    update: control.update,
    trigger: control.trigger,
    reset: control.reset,
    handleSubmit: control.handleSubmit,
    setError: control.setError,
    focus: control.focus,
    resetField: control.resetField,
    clearError: control.clearError,
    register: control.register,
    unregister: control.unregister,
    errors: control.state.errors,
  }

  return reactive(form) as UseFormReturn<Values, Context, TransformedValues>
}
