<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { Controller, useForm } from 'vue-form-use'

const form = useForm({
  defaultValues: {
    username: [] as string[],
    password: '',
  },
})

const onSubmit = form.handleSubmit((data) => {
  console.log('🚀 Submit Data: ', data)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <Controller
      :control="form.control"
      :name="'username' as const"
      :transformer="{
        input: (value = []) => value.join(','),
        output: (value) => value.split(','),
      }"
      #="{ field }"
    >
      <input :value="field.value" @input="field.onChange" @blur="field.onBlur">
      <span>errors: {{ form.errors }}</span>
    </Controller>

    <input :="form.register('password')">

    {{ form.values.username }}
    {{ form.values.password }}
    <button type="submit">
      submit
    </button>
  </form>
</template>
