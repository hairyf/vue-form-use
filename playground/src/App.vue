<script setup lang="ts">
import { Controller, useForm } from 'pkg-placeholder'

const form = useForm({
  defaultValues: {
    name: '',
  },
})

const onSubmit = form.handleSubmit((data) => {
  // eslint-disable-next-line no-console
  console.log(data)
})
</script>

<template>
  <form @submit="onSubmit($event)">
    <button type="submit">
      Submit
    </button>
    <Controller :control="form.control" name="name">
      <template #default="{ field }">
        <input :value="field.value" @input="field.onChange">
      </template>
    </Controller>
  </form>
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
