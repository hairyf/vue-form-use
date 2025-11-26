# vue-form-use

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

Performant, flexible and extensible forms with easy-to-use validation for Vue 3.

## Features

- 🚀 **Performant** - Minimal re-renders and optimized form state management
- 📦 **Lightweight** - Small bundle size with zero dependencies (except Vue)
- 🔒 **Type-safe** - Full TypeScript support with excellent type inference
- 🎯 **Flexible** - Works with any form library and custom components
- 🔧 **Extensible** - Easy to integrate with validation libraries
- 🎨 **Composable** - Built with Vue 3 Composition API

## Installation

```bash
npm i vue-form-use
# or
pnpm add vue-form-use
# or
yarn add vue-form-use
```

## Usage

### Basic Example

```vue
<script setup lang="ts">
import { useForm } from 'pkg-placeholder'

const form = useForm({
  defaultValues: {
    username: '',
  },
})

const onSubmit = form.handleSubmit((data) => {
  console.log('🚀 Submit Data: ', data)
})
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input :="form.register('username', { required: 'username field cannot be empty!' })">
    <button type="submit">
      submit
    </button>
  </form>
  <span>errors: {{ form.errors }}</span>
</template>
```

### Using Resolver Options

```vue
<script setup lang="ts">
import { FieldError, useForm } from 'vue-form-use'
import { yupResolver } from 'vue-form-use/resolver/yup'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
})

const { register, handleSubmit, errors } = useForm({
  defaultValues: { name: '' },
  resolver: yupResolver(schema),
})

const onSubmit = handleSubmit((data) => {
  console.log(data)
})
</script>

<template>
  <form @submit="onSubmit">
    <input :="register('name')" placeholder="Name">
    {{ errors.name?.message }}
    <input :="register('email')" placeholder="Email">
    {{ errors.email?.message }}
    <button type="submit">
      Submit
    </button>
  </form>
</template>
```

### Using Controller Component

For more complex scenarios or when you need fine-grained control, you can use the `Controller` component:

```vue
<script setup lang="ts">
import { Controller, useForm } from 'vue-form-use'

const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
})

const onSubmit = form.handleSubmit((data) => {
  console.log(data)
})
</script>

<template>
  <form @submit="onSubmit">
    <Controller :control="form.control" name="name">
      <template #default="{ field }">
        <input
          :value="field.value"
          placeholder="Name"
          @input="field.onChange"
          @blur="field.onBlur"
        >
      </template>
    </Controller>

    <Controller :control="form.control" name="email">
      <template #default="{ field }">
        <input
          :value="field.value"
          placeholder="Email"
          @input="field.onChange"
          @blur="field.onBlur"
        >
      </template>
    </Controller>

    <button type="submit">
      Submit
    </button>
  </form>
</template>
```

### Form State

Access form state including errors, validation status, and more:

```vue
<script setup lang="ts">
import { useForm } from 'vue-form-use'

const form = useForm({
  defaultValues: {
    email: '',
  },
})

// Access form values (reactive)
const emailValue = computed(() => form.values.email)

// Access form state
const isDirty = computed(() => form.status.isDirty)
const isValid = computed(() => form.status.isValid)
const isSubmitting = computed(() => form.status.isSubmitting)
</script>

<template>
  <form>
    <input :="form.register('email')">
    <p v-if="form.errors.email">
      {{ form.errors.email.message }}
    </p>
    <!-- directly using field values, it has responsiveness -->
    {{ form.values.email }}
    <!-- or use a computed property -->
    {{ emailValue }}
    <!-- access form status -->
    <p>Is Dirty: {{ isDirty }}</p>
    <p>Is Valid: {{ isValid }}</p>
  </form>
</template>
```

### Reset Form

Reset the form to its default values:

```vue
<script setup lang="ts">
import { useForm } from 'vue-form-use'

const form = useForm({
  defaultValues: {
    name: '',
    email: '',
  },
})
</script>

<template>
  <form>
    <input :="form.register('name')">
    <input :="form.register('email')">
    <button type="button" @click="form.reset()">
      Reset
    </button>
  </form>
</template>
```

## API

### `useForm`

The main composable for managing form state.

#### Parameters

```typescript
function useForm(props: UseFormProps): UseFormReturn
```

- `defaultValues` - Default values for the form (can be async function)
- `values` - Controlled form values
- `mode` - Validation mode: `'onSubmit'` | `'onBlur'` | `'onChange'` | `'onTouched'` | `'all'` (default: `'onSubmit'`)
- `reValidateMode` - Re-validation mode: `'onChange'` | `'onBlur'` | `'onSubmit'` (default: `'onChange'`)
- `disabled` - Disable the entire form
- `errors` - External controlled errors
- `resetOptions` - Options for reset behavior (keepDirtyValues, keepErrors, etc.)
- `resolver` - Validation resolver function
- `context` - Custom context object passed to resolver
- `shouldFocusError` - Focus the first error field on submit (default: `true`)
- `shouldUnregister` - Unregister fields on unmount (default: `false`)
- `shouldUseNativeValidation` - Use native HTML5 validation
- `criteriaMode` - Error criteria mode: `'firstError'` | `'all'`
- `delayError` - Delay error display (milliseconds)

#### Returns

- `state` - Reactive form values (the actual form data)
- `status` - Form state object containing:
  - `form` - Form-level state (isDirty, isValid, isSubmitting, etc.)
  - `fields` - Field-level state for each field (invalid, isDirty, isTouched, etc.)
- `control` - Form control instance
- `errors` - Field errors object
- `register` - Register a field
- `unregister` - Unregister a field
- `handleSubmit` - Handle form submission
- `reset` - Reset the form
- `resetField` - Reset a specific field
- `update` - Update form values
- `trigger` - Trigger validation
- `setError` - Set field error manually
- `clearError` - Clear field error
- `focus` - Focus a field

### `Controller`

A component for managing individual form fields with scoped slots.

#### Props

- `name` - Field name (typed)
- `control` - Form control instance from `useForm`

#### Slots

- `default` - Receives `{ field, state }` where:
  - `field` - Field props (value, onChange, onBlur, etc.)
  - `state` - Form state

### `useController`

A composable alternative to the `Controller` component.

```ts
const controller = useController({
  control: form.control,
  name: 'fieldName',
})
```

## TypeScript

Full TypeScript support with excellent type inference:

```ts
interface FormValues {
  name: string
  email: string
  age: number
}

const form = useForm<FormValues>({
  defaultValues: {
    name: '',
    email: '',
    age: 0,
  },
})

// Type-safe field access
form.values.name // string
form.values.email // string
form.values.age // number

// Access form status
form.status.isDirty // boolean
form.status.isValid // boolean
form.status.fields.name.isDirty // boolean
form.status.fields.name.error // FieldError | undefined
```

## License

MIT License © 2024-PRESENT [Hairyf](https://github.com/hairyf)

---

[npm-version-src]: https://img.shields.io/npm/v/vue-form-use?colorA=18181B&colorB=28CF8D&style=flat-square
[npm-version-href]: https://npmjs.com/package/vue-form-use
[npm-downloads-src]: https://img.shields.io/npm/dm/vue-form-use?colorA=18181B&colorB=28CF8D&style=flat-square
[npm-downloads-href]: https://npmjs.com/package/vue-form-use
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vue-form-use?colorA=18181B&colorB=28CF8D&label=minzip&style=flat-square
[bundle-href]: https://bundlephobia.com/result?p=vue-form-use
[license-src]: https://img.shields.io/npm/l/vue-form-use?colorA=18181B&colorB=28CF8D&style=flat-square
[license-href]: https://github.com/hairyf/vue-form-use/blob/main/LICENSE.md
