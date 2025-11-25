<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts" generic="Values extends FieldValues, TransformedValues extends FieldValues = Values">
import type { FieldValues } from '../types'
import type { FormHTMLAttributes, FormProps, SubmitEvents } from './form'
import { useAttrs } from 'vue'
import { fetchByAction, stringifyData } from 'vue-form-use'

const props = defineProps<FormProps<Values, TransformedValues>>()
defineEmits<{
  submit: [SubmitEvents<TransformedValues>]
}>()

const attrs = useAttrs() as FormHTMLAttributes

async function onValidSubmit(event: SubmitEvent, data: any): Promise<void> {
  let hasError = false
  let type = ''

  try {
    if (props.onSubmit) {
      await props.onSubmit?.({
        formData: stringifyData('form-data', data),
        formDataJson: stringifyData('json', data),
        method: attrs.method,
        data,
        event,
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
</script>

<template>
  <form v-bind="$attrs" no-validate @submit="onSubmit">
    <slot />
  </form>
</template>
