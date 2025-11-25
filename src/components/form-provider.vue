<script setup lang="ts" generic="Values extends FieldValues, Context = any, TransformedValues extends FieldValues = Values">
import type { FieldValues, UseFormReturn } from '../types'
import { provide } from 'vue'
import { formInjectionKey } from '../constants'

const props = defineProps<UseFormReturn<Values, Context, TransformedValues>>()

provide(formInjectionKey, props as any)
</script>

<template>
  <slot />
</template>
