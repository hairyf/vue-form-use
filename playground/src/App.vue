<!-- eslint-disable no-console -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { useForm } from 'vue-form-use'
import UInput from './components/u-input.vue'

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
    <UInput :="form.register('password')" />

    {{ form.values.password }}
    <button type="submit">
      submit
    </button>
  </form>
</template>
