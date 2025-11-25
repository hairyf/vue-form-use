<script setup lang="ts" generic="Values extends FieldValues, Name extends FieldPath<Values>, TransformedValues extends FieldValues = Values">
import type { Slot } from 'vue'
import type { Control, FieldPath, FieldProps, FieldValues, State } from 'vue-form-use'
import { useController } from 'vue-form-use'

const props = defineProps<{
  name: Name
  control: Control<Values, any, TransformedValues>
}>()

defineSlots<{
  default: Slot<{ field: FieldProps<Values, Name>, state: State<Values> }>
}>()

const controller = useController(props)
</script>

<template>
  <slot :field="controller.field" :state="controller.state" />
</template>
