import type { SetupContext, VNode, VNodeChild } from 'vue'
import type { ChangeHandler, Control, FieldPath, FieldPathValue, FieldValues } from '../types'
import { defineComponent } from 'vue'

export interface ControllerProps<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
  TransformedValues extends FieldValues = Values,
> {
  name: Name
  control: Control<Values, any, TransformedValues>
}

export interface FieldProps<
  Values extends FieldValues,
  Name extends FieldPath<Values> = FieldPath<Values>,
> {
  name: Name
  value: FieldPathValue<Values, Name>
  onChange: ChangeHandler
  onBlur: ChangeHandler
  disabled?: boolean
}

export interface ControllerSlots<Values extends FieldValues> {
  default: (props: FieldProps<Values>) => VNode
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

export const Controller = defineComponent(
  <
    Values extends FieldValues,
    Name extends FieldPath<Values> = FieldPath<Values>,
    TransformedValues extends FieldValues = Values,
  >(props: ControllerProps<Values, Name, TransformedValues>,
    context: SetupContext<ControllerSlots<Values>>,
  ) => {
    return () => {
      const registerProps = props.control.register(props.name)
    }
  },
)
