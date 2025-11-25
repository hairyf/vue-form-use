/* eslint-disable ts/no-redeclare */
import type { Slot } from 'vue'
import type { Control, FieldPath, FieldProps, FieldValues, State } from '../types'
import { defineComponent } from 'vue'
import { useController } from '../composable/use-controller'

export interface ControllerProps<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
> {
  name: Name
  control: Control<Values, any, TransformedValues>
}

export interface ControllerSlots<Values extends FieldValues, Name extends FieldPath<Values>> {
  default?: Slot<{ name: Name, field: FieldProps<Values, Name>, state: State<Values> }>
}

/**
 * Component based on `useController` hook to work with controlled component.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/usecontroller/controller) • [Demo](https://codesandbox.io/s/react-hook-form-v6-controller-ts-jwyzw) • [Video](https://www.youtube.com/watch?v=N2UNk_UCVyA)
 *
 * @param props - the path name to the form field value, and validation rules.
 *
 * @returns provide field handler functions, field and form state.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   const { control } = useForm<FormValues>({
 *     defaultValues: {
 *       test: ""
 *     }
 *   });
 * </script>
 *
 * <template>
 *   <form v-bind="control">
 *     <controller :control="control" name="test" #="{ field: { onChange, onBlur, value, ref }, state }">
 *       <input
 *         @change="onChange"
 *         @blur="onBlur"
 *         :value="value"
 *         ref="ref"
 *       />
 *       <p>{{ state.isSubmitted ? "submitted" : "" }}</p>
 *       <p>{{ state.isTouched ? "touched" : "" }}</p>
 *     </controller>
 *   </form>
 * </template>
 * ```
 */

export type Controller = new<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
>(props: ControllerProps<Values, Name, TransformedValues>) => {
  $props: ControllerProps<Values, Name, TransformedValues>
  $slots: ControllerSlots<Values, Name>
}

const Component = defineComponent({
  props: ['control', 'name'],
  setup(props: ControllerProps<any, any, any>, { slots }: { slots: ControllerSlots<any, any> }) {
    const controller = useController(props)
    return () => slots.default?.({
      field: controller.field,
      state: controller.state,
      name: props.name,
    })
  },
})

export const Controller = Component as unknown as Controller
