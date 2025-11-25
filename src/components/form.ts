/* eslint-disable ts/no-redeclare */
/**
 * Form component to manage submission.
 *
 * @param props - to setup submission detail. {@link FormProps}
 *
 * @returns form component or headless render prop.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   const { control, register, errors } = useForm();
 * </script>
 *
 * <template>
 *   <form action="/api" v-bind="control">
 *     <input v-bind="register('name')" />
 *     <p>{{ errors?.root?.server && 'Server error' }}</p>
 *     <button>Submit</button>
 *   </form>
 * </template>
 * ```
 */

import type { FormHTMLAttributes as _FormHTMLAttributes } from 'vue'
import type { Control, FieldValues } from '../types'
import { defineComponent, h } from 'vue'
import { fetchByAction, stringifyData } from '../logic'

export type FormHTMLAttributes = Omit<_FormHTMLAttributes, 'onSubmit' | 'onError' | 'onSuccess' | 'headers'>

export interface SubmitEvents<
  Values extends FieldValues = FieldValues,
> {
  data: Values
  event: SubmitEvent
  method?: string
  formData: FormData
  formDataJson: string
}

export interface FormProps<
  Values extends FieldValues = FieldValues,
  TransformedValues extends FieldValues = Values,
> {
  control: Control<Values, any, TransformedValues>
  headers?: Record<string, string>
  onSubmit?: (values: SubmitEvents<TransformedValues>) => Promise<void>
  onSuccess?: ({ response }: { response: Response }) => void
  onError?: (error: any) => void
  validate?: (response: Response) => Promise<boolean> | boolean
}

export type Form = new<
  Values extends FieldValues,
  TransformedValues extends FieldValues = Values,
>(props: FormProps<Values, TransformedValues> & FormHTMLAttributes) => {
  $props: FormProps<Values, TransformedValues> & FormHTMLAttributes
}

const Component = defineComponent({
  props: ['control', 'onSubmit', 'onSuccess', 'onError', 'headers'],
  inheritAttrs: true,
  setup(props: FormProps<any, any>, { slots, attrs }: { slots: any, attrs: any }) {
    // TODO: default use form context
    // const methods = useFormContext<Values, any, TransformedValues>();

    async function onValidSubmit(event: SubmitEvent, data: any): Promise<void> {
      let hasError = false
      let type = ''

      try {
        if (props.onSubmit) {
          await props.onSubmit?.({
            formData: stringifyData('form-data', data),
            formDataJson: stringifyData('json', data),
            data,
            event,
            method: attrs.method,
          })
        }

        if (attrs.action) {
          const response = await fetchByAction({
            action: attrs.action as string,
            method: attrs.method,
            headers: props.headers,
            data,
          })

          const isVerified = props.validate
            ? await props.validate(response.clone())
            : response.status >= 200 && response.status < 300

          if (!isVerified) {
            hasError = true
            props.onError?.({ response })
            type = String(response.status)
            return
          }

          props.onSuccess?.({ response })
        }
      }
      catch (error) {
        hasError = true
        props.onError?.({ error })
      }
      if (hasError) {
        props.control.state.form.isSubmitSuccessful = false
        props.control.setError('root.server', { type })
      }
    }

    async function onSubmit(event: SubmitEvent): Promise<void> {
      if (!props.control) {
        event.preventDefault()
        return
      }
      await props.control.handleSubmit(data => onValidSubmit(event, data))?.(event)
    }
    return () => h(
      'form',
      {
        ...attrs,
        noValidate: true,
        onSubmit,
      },
      slots.default?.(),
    )
  },
})

export const Form = Component as unknown as Form
