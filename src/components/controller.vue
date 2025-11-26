<script setup lang="ts" generic="Values extends FieldValues, Name extends FieldPath<Values>, TransformedValues extends FieldValues = Values">
import type { Slot } from 'vue'
import type { ControllerProps, FieldPath, FieldProps, FieldValues, State } from 'vue-form-use'
import { useController } from 'vue-form-use'

const props = defineProps<ControllerProps<Values, Name, TransformedValues>>()

defineSlots<{
  default: Slot<{ field: FieldProps<Values, Name>, state: State<Values> }>
}>()

const controller = useController(props)
</script>

<template>
  <slot :field="controller.field" :state="controller.state" />
</template>
