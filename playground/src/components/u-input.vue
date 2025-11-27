<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
  (e: 'change'): void
}>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <input v-model="value" @blur="emit('blur')" @change="emit('change')">
</template>
