<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

const componentRef = ref()
const elementRef = ref()

onMounted(() => {
  console.log('🚀 Component Ref: ', componentRef.value)
  console.log('🚀 Element Ref: ', elementRef.value)
})
</script>

<template>
  <form ref="elementRef" style="display: flex; flex-direction: column; gap: 10px;" @submit.prevent="onSubmit">
    <label>name</label>
    <input :="form.register('name')">
    {{ form.state.errors.name?.message }}
    <label>cert_no</label>
    <input :="form.register('cert_no')">
    {{ form.state.errors.cert_no?.message }}
    <label>cert_begin_date</label>
    <input :="form.register('cert_begin_date')">
    {{ form.state.errors.cert_begin_date?.message }}
    <label>cert_end_date</label>
    <input :="form.register('cert_end_date')">
    {{ form.state.errors.cert_end_date?.message }}
    <label>cert_validity_type</label>
    <input :="form.register('cert_validity_type')">
    {{ form.state.errors.cert_validity_type?.message }}
    <button type="submit">
      submit
    </button>
  </form>
</template>
