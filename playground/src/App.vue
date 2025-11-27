<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { useForm } from 'vue-form-use'
import * as yup from 'yup'
import { yupResolver } from '../../src/resolver/yup'

const schema = yup.object({
  name: yup.string().required(),
  cert_no: yup.string().required(),
  cert_begin_date: yup.string().required(),
  cert_end_date: yup.string().required(),
  cert_validity_type: yup.string().required(),
})
const form = useForm({
  defaultValues: {
    name: '',
    cert_no: '',
    cert_begin_date: null,
    cert_end_date: null,
    cert_validity_type: '1',
  },
  resolver: yupResolver(schema),
})

const onSubmit = form.handleSubmit((data) => {
  console.log('🚀 Submit Data: ', data)
})
</script>

<template>
  <form style="display: flex; flex-direction: column; gap: 10px;" @submit.prevent="onSubmit">
    <input :="form.register('name')">
    <input :="form.register('cert_no')">
    <input :="form.register('cert_begin_date')">
    <input :="form.register('cert_end_date')">
    <input :="form.register('cert_validity_type')">

    {{ form.state.errors.cert_end_date?.message }}
    <button type="submit">
      submit
    </button>
  </form>
</template>
