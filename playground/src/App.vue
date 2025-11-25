<script setup lang="ts">
import { useForm } from 'pkg-placeholder'

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
  <form style="display: flex; flex-direction: column; gap: 12px;" @submit="onSubmit">
    <input :="form.register('name', { required: { value: true, message: 'Name is required' } })">
    <p v-if="form.state.errors.name">
      {{ form.state.errors.name.message }}
    </p>
    <button type="submit">
      Submit
    </button>
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
