<script setup lang="ts">
import type { SubmitEvents } from 'pkg-placeholder'
import { Controller, Form, useForm } from 'pkg-placeholder'

const form = useForm({
  defaultValues: {
    name: '',
  },
})

async function onSubmit({ data }: SubmitEvents<{ name: string }>) {
  // eslint-disable-next-line no-console
  console.log(data)
}
</script>

<template>
  <Form :control="form.control" @submit="onSubmit">
    <button type="submit">
      Submit
    </button>
    <Controller :control="form.control" name="name">
      <template #default="{ field }">
        <input :value="field.value" @input="field.onChange">
      </template>
    </Controller>
  </Form>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
