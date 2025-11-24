<script setup lang="ts" generic="Values extends FieldValues, Name extends FieldPath<Values>, TransformedValues extends FieldValues = Values">
import type { Control, FieldPath, FieldValues } from '../types'
import { useController } from '../composable/use-controller'

const props = defineProps<{
  name: Name
  control: Control<Values, any, TransformedValues>
}>()

const controller = useController(props)
</script>

<template>
  <slot :name="name" :field="controller.field" />
</template>
