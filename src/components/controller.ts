import type { SetupContext, Slot, SlotsType, VNode } from 'vue'
import type { Control, FieldPath, FieldProps, FieldValues } from '../types'
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

export type ControllerSlots<Values extends FieldValues, Name extends FieldPath<Values>> = SlotsType<{
  default?: Slot<{ name: Name, field: FieldProps<Values, Name> }>
}>
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

export const Controller = defineComponent(
  <
    Values extends FieldValues,
    Name extends FieldPath<Values> = FieldPath<Values>,
    TransformedValues extends FieldValues = Values,
  >(
    props: ControllerProps<Values, Name, TransformedValues>,
    context: SetupContext<unknown, ControllerSlots<Values, Name>>,
  ) => {
    const controller = useController(props)
    return () => context.slots.default?.({ name: props.name, field: controller.field })
  },

)
