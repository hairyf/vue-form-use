<script setup lang="ts" generic="Values extends FieldValues, Context = any, TransformedValues extends FieldValues = Values">
import type { FieldValues, UseFormReturn } from '../types'
import { provide } from 'vue'
import { formInjectionKey } from 'vue-form-use'

const props = defineProps<UseFormReturn<Values, Context, TransformedValues>>()

provide(formInjectionKey, props as UseFormReturn<any, any, any>)
</script>

<template>
  <slot />
</template>
