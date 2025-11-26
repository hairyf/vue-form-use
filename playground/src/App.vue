<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { useForm } from 'vue-form-use'

const form = useForm({
  defaultValues: {
    username: '',
  },
})

const onSubmit = form.handleSubmit((data) => {
  console.log('🚀 Submit Data: ', data)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input :="form.register('username', { required: 'username field cannot be empty!' })">
    <button type="submit">
      submit
    </button>
  </form>
  <span>errors: {{ form.errors }}</span>
</template>
