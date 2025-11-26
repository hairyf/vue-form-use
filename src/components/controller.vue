<script setup lang="ts" generic="Values extends FieldValues, Name extends FieldPath<Values>, TransformedValues extends FieldValues = Values">
import type { ControllerProps, ControllerSlots, FieldPath, FieldValues } from 'vue-form-use'
import { useController } from 'vue-form-use'

const props = defineProps<ControllerProps<Values, Name, TransformedValues>>()

defineSlots<ControllerSlots<Values, Name>>()

const controller = useController(props)
</script>

<template>
  <slot :field="controller.field" :state="controller.state" />
</template>
