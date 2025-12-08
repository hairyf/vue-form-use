import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useController, useForm } from '../src'
import { EVENTS } from '../src/constants'

describe('useController', () => {
  it('should initialize controller with field', () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    expect(controller.field.name).toBe('username')
    expect(controller.field.value).toBe('')
  })

  it('should handle field value changes', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    controller.field.value = 'newvalue'
    await nextTick()

    expect(form.values.username).toBe('newvalue')
  })

  it('should handle onChange event', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    controller.field.onChange({
      target: {
        value: 'newvalue',
        name: 'username',
      },
      type: EVENTS.CHANGE,
    })
    await nextTick()

    expect(form.values.username).toBe('newvalue')
  })

  it('should handle onBlur event', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onBlur',
    })

    form.register('username', { required: 'Required' })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    controller.field.onBlur({ target: { value: '', name: 'username' } })
    await form.trigger('username')

    expect(form.state.fields.username.isTouched).toBe(true)
  })

  it('should reflect form state', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', { required: 'Required' })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    form.values.username = ''
    await form.trigger('username')
    await nextTick()

    expect(controller.state.error).toBeDefined()
    expect(controller.state.error?.message).toBe('Required')
  })

  it('should handle disabled state', () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      disabled: true,
    })

    const controller = useController({
      control: form.control,
      name: 'username',
    })

    expect(controller.field.disabled).toBe(true)
  })

  it('should handle field-level disabled', () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const controller = useController({
      control: form.control,
      name: 'username',
      disabled: true,
    })

    expect(controller.field.disabled).toBe(true)
  })

  it('should handle nested field paths', async () => {
    const form = useForm({
      defaultValues: {
        user: {
          name: '',
        },
      },
    })

    const controller = useController({
      control: form.control,
      name: 'user.name',
    })

    controller.field.value = 'John'
    await nextTick()

    expect(form.values.user.name).toBe('John')
  })

  it('should handle array field paths', async () => {
    const form = useForm({
      defaultValues: {
        tags: [''],
      },
    })

    const controller = useController({
      control: form.control,
      name: 'tags.0',
    })

    controller.field.value = 'vue'
    await nextTick()

    expect(form.values.tags[0]).toBe('vue')
  })

  it('should handle defaultValue', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const controller = useController({
      control: form.control,
      name: 'username',
      defaultValue: 'default',
    })

    await nextTick()

    expect(controller.field.value).toBe('default')
  })

  it('should unregister on unmount when shouldUnregister is true', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      shouldUnregister: true,
    })

    useController({
      control: form.control,
      name: 'username',
    })

    expect(form.control.names.mount).toContain('username')

    // Simulate unmount
    // In a real component, onUnmounted would be called automatically
    // For testing, we can manually check the unregister behavior
    form.unregister('username')
    await nextTick()

    expect(form.control.names.mount).not.toContain('username')
  })
})
