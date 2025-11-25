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
import { flatten } from '../utils'

export type FormHTMLAttributes = Omit<_FormHTMLAttributes, 'onSubmit' | 'onError' | 'onSuccess' | 'headers'>

export interface SubmitEvents<
  Values extends FieldValues = FieldValues,
> {
  data: Values
  event: SubmitEvent
  method: string
  formData: FormData
  formDataJson: string
}

export interface FormProps<
  Values extends FieldValues = FieldValues,
  TransformedValues extends FieldValues = Values,
> extends FormHTMLAttributes {
  control: Control<Values, any, TransformedValues>
  headers?: Record<string, string>
  onSubmit?: (values: SubmitEvents<TransformedValues>) => Promise<void>
  onSuccess?: (values: Values) => void
  onError?: (error: any) => void

  validate?: (response: Response) => Promise<boolean> | boolean

}

export type Form = new<
  Values extends FieldValues,
  TransformedValues extends FieldValues = Values,
>(props: FormProps<Values, TransformedValues>) => {
  $props: FormProps<Values, TransformedValues>
}

const Component = defineComponent({
  props: ['control', 'onSubmit', 'onSuccess', 'onError', 'headers'],
  inheritAttrs: true,
  setup(props: FormProps<any, any>, { slots, attrs }: { slots: any, attrs: any }) {
    // TODO: default use form context
    // const methods = useFormContext<Values, any, TransformedValues>();
    async function onSubmit(event: SubmitEvent): Promise<void> {
      if (!props.control) {
        event.preventDefault()
        return
      }

      let hasError = false
      let type = ''
      // TODO
      await props.control.handleSubmit(async (data) => {
        try {
          const formData = new FormData()
          let formDataJson = ''

          try {
            formDataJson = JSON.stringify(data)
          }
          catch {}

          const flattenFormValues = flatten(props.control?._values)

          for (const key in flattenFormValues) {
            formData.append(key, flattenFormValues[key])
          }

          const shouldStringifySubmissionData = [
            props.headers && props.headers['Content-Type'],
            attrs.encType,
          ].some(value => value && value.includes('json'))

          if (props.onSubmit) {
            await props.onSubmit({
              data,
              event,
              method: attrs.method,
              formData,
              formDataJson,
            })
          }

          if (attrs.action) {
            const response = await fetch(attrs.action as string, {
              method: attrs.method,
              headers: {
                ...props.headers,
                ...(attrs.encType && attrs.encType !== 'multipart/form-data'
                  ? { 'Content-Type': attrs.encType }
                  : {}),
              },
              body: shouldStringifySubmissionData ? formDataJson : formData,
            })
            if (
              (props.validate
                ? !(await props.validate(response.clone()))
                : response.status < 200 || response.status >= 300)
            ) {
              hasError = true
              props.onError?.({ response })
              type = String(response.status)
            }
            else {
              props.onSuccess?.({ response })
            }
          }
        }
        catch (error) {
          hasError = true
          props.onError?.({ error })
        }
      })?.(event)

      if (hasError) {
        props.control.state.form.isSubmitSuccessful = false
        props.control.setError('root.server', { type })
      }
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
