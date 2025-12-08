import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from '../../src'

describe('form Operations', () => {
  describe('reset', () => {
    it('should reset form to default values', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
          email: 'initial@example.com',
        },
      })

      form.values.username = 'changed'
      form.values.email = 'changed@example.com'

      form.reset()
      await nextTick()

      expect(form.values.username).toBe('initial')
      expect(form.values.email).toBe('initial@example.com')
    })

    it('should reset form with new values', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
        },
      })

      form.reset({ username: 'newvalue' })
      await nextTick()

      expect(form.values.username).toBe('newvalue')
    })

    it('should reset form with function', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
        },
      })

      form.values.username = 'changed'
      form.reset(values => ({ username: `${values.username}-reset` }))
      await nextTick()

      expect(form.values.username).toBe('changed-reset')
    })

    it('should reset form state', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.values.username = 'test'
      await form.trigger('username')
      await nextTick()

      expect(form.state.isDirty).toBe(true)
      expect(form.state.isSubmitted).toBe(false)

      form.reset()
      await nextTick()

      expect(form.state.isDirty).toBe(false)
      expect(form.state.isSubmitted).toBe(false)
    })

    it('should keep dirty values when keepDirtyValues is true', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
          email: 'initial@example.com',
        },
      })

      form.values.username = 'changed'
      form.values.email = 'initial@example.com'

      // Mark username as dirty
      const registerProps = form.register('username')
      registerProps.onBlur({ target: { value: 'changed', name: 'username' } })
      await nextTick()

      form.reset(undefined, { keepDirtyValues: true })
      await nextTick()

      expect(form.values.username).toBe('changed')
      expect(form.values.email).toBe('initial@example.com')
    })

    it('should keep errors when keepErrors is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.values.username = ''
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username).toBeDefined()

      form.reset(undefined, { keepErrors: true })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })

    it('should keep touched state when keepTouched is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      const registerProps = form.register('username')
      registerProps.onBlur({ target: { value: 'test', name: 'username' } })
      await nextTick()

      expect(form.state.fields.username.isTouched).toBe(true)

      form.reset(undefined, { keepTouched: true })
      await nextTick()

      expect(form.state.fields.username.isTouched).toBe(true)
    })

    it('should keep dirty state when keepDirty is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.values.username = 'changed'
      const registerProps = form.register('username')
      registerProps.onBlur({ target: { value: 'changed', name: 'username' } })
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(true)

      form.reset(undefined, { keepDirty: true })
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(true)
    })
  })

  describe('resetField', () => {
    it('should reset single field to default value', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
          email: 'initial@example.com',
        },
      })

      form.values.username = 'changed'
      form.values.email = 'changed@example.com'

      form.resetField('username')
      await nextTick()

      expect(form.values.username).toBe('initial')
      expect(form.values.email).toBe('changed@example.com')
    })

    it('should reset field with new default value', async () => {
      const form = useForm({
        defaultValues: {
          username: 'initial',
        },
      })

      form.values.username = 'changed'
      form.resetField('username', { defaultValue: 'newdefault' })
      await nextTick()

      expect(form.values.username).toBe('newdefault')
    })

    it('should reset field state', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.values.username = 'test'
      const registerProps = form.register('username')
      registerProps.onBlur({ target: { value: 'test', name: 'username' } })
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(true)
      expect(form.state.fields.username.isTouched).toBe(true)

      form.resetField('username')
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(false)
      expect(form.state.fields.username.isTouched).toBe(false)
    })

    it('should keep dirty state when keepDirty is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.values.username = 'changed'
      const registerProps = form.register('username')
      registerProps.onBlur({ target: { value: 'changed', name: 'username' } })
      await nextTick()

      form.resetField('username', { keepDirty: true })
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(true)
    })

    it.only('should keep touched state when keepTouched is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      const registerProps = form.register('username')

      registerProps.onBlur({ target: { value: 'test', name: 'username' } })
      await nextTick()

      form.resetField('username', { keepTouched: true })
      await nextTick()

      expect(form.state.fields.username.isTouched).toBe(true)
    })

    it('should keep error when keepError is true', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.values.username = ''
      await form.trigger('username')
      await nextTick()

      form.resetField('username', { keepError: true })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })
  })

  describe('update', () => {
    it('should update field value', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.update('username', 'newvalue')
      await nextTick()

      expect(form.values.username).toBe('newvalue')
    })

    it('should update nested field value', async () => {
      const form = useForm({
        defaultValues: {
          user: {
            name: '',
          },
        },
      })

      form.update('user.name', 'John')
      await nextTick()

      expect(form.values.user.name).toBe('John')
    })

    it('should update with shouldDirty option', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.update('username', 'newvalue', { shouldDirty: true })
      await nextTick()

      expect(form.state.fields.username.isDirty).toBe(true)
    })

    it('should update with shouldTouch option', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.update('username', 'newvalue', { shouldTouch: true })
      await nextTick()

      expect(form.state.fields.username.isTouched).toBe(true)
    })

    it('should update with shouldValidate option', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Required' })
      form.update('username', '', { shouldValidate: true })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })
  })

  describe('setError', () => {
    it('should set error for field', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.setError('username', {
        type: 'manual',
        message: 'Custom error',
      })
      await nextTick()

      expect(form.errors.username?.message).toBe('Custom error')
      expect(form.errors.username?.type).toBe('manual')
    })

    it('should set root error', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.setError('root', {
        type: 'manual',
        message: 'Root error',
      })
      await nextTick()

      expect(form.errors.root?.message).toBe('Root error')
    })

    it('should set nested error', async () => {
      const form = useForm({
        defaultValues: {
          user: {
            name: '',
          },
        },
      })

      form.setError('user.name', {
        type: 'manual',
        message: 'Nested error',
      })
      await nextTick()

      expect(form.errors.user?.name?.message).toBe('Nested error')
    })
  })

  describe('clearError', () => {
    it('should clear error for single field', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.values.username = ''
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username).toBeDefined()

      form.clearError('username')
      await nextTick()

      expect(form.errors.username).toBeUndefined()
    })

    it('should clear errors for multiple fields', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
          email: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.register('email', { required: 'Required' })
      form.values.username = ''
      form.values.email = ''
      await form.trigger()
      await nextTick()

      expect(form.errors?.username).toBeDefined()
      expect(form.errors?.email).toBeDefined()

      form.clearError(['username', 'email'])
      await nextTick()

      expect(form.errors.username).toBeUndefined()
      expect(form.errors.email).toBeUndefined()
    })

    it('should clear all errors when no argument provided', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
          email: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      form.register('email', { required: 'Required' })
      form.values.username = ''
      form.values.email = ''
      await form.trigger()
      await nextTick()

      form.clearError()
      await nextTick()

      expect(form.errors.username).toBeUndefined()
      expect(form.errors.email).toBeUndefined()
    })

    it('should clear root error', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      form.setError('root', {
        type: 'manual',
        message: 'Root error',
      })
      await nextTick()

      form.clearError('root')
      await nextTick()

      expect(form.errors.root).toBeUndefined()
    })
  })

  describe('focus', () => {
    it('should focus field element', () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      const input = document.createElement('input')
      input.name = 'username'
      const registerProps = form.register('username')
      registerProps.ref(input, {})

      const focusSpy = vi.spyOn(input, 'focus')
      form.focus('username')

      expect(focusSpy).toHaveBeenCalled()
    })

    it('should select text when shouldSelect is true', () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
      })

      const input = document.createElement('input')
      input.name = 'username'
      const registerProps = form.register('username')
      registerProps.ref(input, {})

      const selectSpy = vi.spyOn(input, 'select')
      form.focus('username', { shouldSelect: true })

      expect(selectSpy).toHaveBeenCalled()
    })
  })
})
