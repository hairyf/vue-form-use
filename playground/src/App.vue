<script setup lang="ts">
import { useForm } from 'pkg-placeholder'

const form = useForm({
  defaultValues: {
    name: '',
  },
})

function onSubmit(data: any) {
  console.log(data)
}
</script>

<template>
  <form @submit="form.handleSubmit(onSubmit)($event)">
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
