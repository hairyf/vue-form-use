import type { FieldValues, UseFormReturn } from '../types'
import { defineComponent, provide } from 'vue'
import { formInjectionKey } from '../constants'

/* eslint-disable ts/no-redeclare */
/**
 * A provider component that propagates the `useForm` methods to all children components via [React Context](https://react.dev/reference/react/useContext) API. To be used with {@link useFormContext}.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)
 *
 * @param props - all useForm methods
 *
 * @example
 * ```tsx
 * function App() {
 *   const methods = useForm();
 *   const onSubmit = data => console.log(data);
 *
 *   return (
 *     <FormProvider {...methods} >
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <NestedInput />
 *         <input type="submit" />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 *
 *  function NestedInput() {
 *   const { register } = useFormContext(); // retrieve all hook methods
 *   return <input {...register("test")} />;
 * }
 * ```
 */
export type FormProvider = new<
  Values extends FieldValues,
  Context = any,
  TransformedValues extends FieldValues = Values,
>(props: UseFormReturn<Values, Context, TransformedValues>) => {
  $props: UseFormReturn<Values, Context, TransformedValues>
  $slots: any
}

const Component = defineComponent(
  (
    props: UseFormReturn<any, any, any>,
    { slots }: { slots: any },
  ) => {
    provide(formInjectionKey, props)
    return slots.default?.()
  },
  {
    props: [
      'control',
      'values',
      'errors',
      'state',
      'trigger',
      'reset',
      'handleSubmit',
      'setError',
      'clearError',
      'register',
      'unregister',
      'focus',
      'resetField',
    ] as any[],
  },
)

export const FormProvider = Component as unknown as FormProvider
