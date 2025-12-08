import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from '../src'

describe('useForm', () => {
  it('should initialize with default values', () => {
    const form = useForm({
      defaultValues: {
        username: 'test',
        email: 'test@example.com',
      },
    })

    expect(form.values.username).toBe('test')
    expect(form.values.email).toBe('test@example.com')
  })

  it('should register a field', () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const registerProps = form.register('username')
    expect(registerProps).toBeDefined()
    expect(registerProps.name).toBe('username')
  })

  it('should handle field value changes', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    const registerProps = form.register('username')
    registerProps.onChange({ target: { value: 'newvalue', name: 'username' } })

    await nextTick()
    expect(form.values.username).toBe('newvalue')
  })

  it('should validate required field', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', { required: 'Username is required' })
    form.values.username = ''

    await form.trigger('username')
    await nextTick()

    expect(form.errors.username).toBeDefined()
    expect(form.errors.username?.message).toBe('Username is required')
  })

  it('should validate minLength', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', {
      minLength: {
        value: 5,
        message: 'Username must be at least 5 characters',
      },
    })

    form.values.username = 'abc'
    await form.trigger('username')
    await nextTick()

    expect(form.errors.username?.message).toBe('Username must be at least 5 characters')
  })

  it('should validate maxLength', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', {
      maxLength: {
        value: 10,
        message: 'Username must be at most 10 characters',
      },
    })

    form.values.username = 'this is too long'
    await form.trigger('username')
    await nextTick()

    expect(form.errors.username?.message).toBe('Username must be at most 10 characters')
  })

  it('should validate pattern', async () => {
    const form = useForm({
      defaultValues: {
        email: '',
      },
      mode: 'onChange',
    })

    form.register('email', {
      pattern: {
        value: /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/,
        message: 'Invalid email format',
      },
    })

    form.values.email = 'invalid-email'
    await form.trigger('email')
    await nextTick()

    expect(form.errors.email?.message).toBe('Invalid email format')
  })

  it('should handle custom validation function', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', {
      validate: (value) => {
        if (value === 'admin') {
          return 'Username cannot be admin'
        }
        return true
      },
    })

    form.values.username = 'admin'
    await form.trigger('username')
    await nextTick()

    expect(form.errors.username?.message).toBe('Username cannot be admin')
  })

  it('should handle async validation', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', {
      validate: async (value) => {
        await new Promise(resolve => setTimeout(resolve, 10))
        if (value === 'taken') {
          return 'Username is already taken'
        }
        return true
      },
    })

    form.values.username = 'taken'
    await form.trigger('username')
    await nextTick()

    expect(form.errors.username?.message).toBe('Username is already taken')
  })

  it.skip('should track form state - isDirty', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    expect(form.state.isDirty).toBe(false)

    form.values.username = 'changed'
    await nextTick()

    const registerProps = form.register('username')
    registerProps.onBlur({ target: { value: 'changed', name: 'username' } })
    await nextTick()

    expect(form.state.isDirty).toBe(true)
  })

  it('should track form state - isValid', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', { required: 'Required' })
    expect(form.state.isValid).toBe(true)

    form.values.username = ''
    await form.trigger('username')
    await nextTick()

    expect(form.state.isValid).toBe(false)
  })

  it('should handle form submission - valid', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    form.register('username', { required: 'Required' })
    form.values.username = 'testuser'

    const onSubmit = vi.fn()
    const handleSubmit = form.handleSubmit(onSubmit)

    await handleSubmit({ preventDefault: vi.fn() })
    await nextTick()

    expect(onSubmit).toHaveBeenCalledWith({ username: 'testuser' }, expect.any(Object))
    expect(form.state.isSubmitSuccessful).toBe(true)
  })

  it('should handle form submission - invalid', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    form.register('username', { required: 'Username is required' })
    form.values.username = ''

    const onSubmit = vi.fn()
    const onInvalid = vi.fn()
    const handleSubmit = form.handleSubmit(onSubmit, onInvalid)

    await handleSubmit({ preventDefault: vi.fn() })
    await nextTick()

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onInvalid).toHaveBeenCalled()
    expect(form.state.isSubmitSuccessful).toBe(false)
  })

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

  it('should reset a specific field', async () => {
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

  it('should update field value with options', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    form.update('username', 'newvalue', {
      shouldDirty: true,
      shouldTouch: true,
    })
    await nextTick()

    expect(form.state.fields.username.isDirty).toBe(true)
    expect(form.state.fields.username.isTouched).toBe(true)
  })

  it('should set error manually', async () => {
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
  })

  it('should clear error', async () => {
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

  it('should handle multiple fields', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
        email: '',
        age: 0,
      },
    })

    form.register('username', { required: 'Username required' })
    form.register('email', { required: 'Email required' })
    form.register('age', { min: { value: 18, message: 'Must be 18+' } })

    form.values.username = 'testuser'
    form.values.email = 'test@example.com'
    form.values.age = 20

    await form.trigger()
    await nextTick()

    expect(form.state.isValid).toBe(true)
  })

  it('should handle nested field paths', async () => {
    const form = useForm({
      defaultValues: {
        user: {
          name: '',
          email: '',
        },
      },
    })

    form.register('user.name', { required: 'Name required' })
    form.register('user.email', { required: 'Email required' })

    form.values.user.name = 'John'
    form.values.user.email = 'john@example.com'

    await form.trigger()
    await nextTick()

    expect(form.state.isValid).toBe(true)
    expect(form.values.user.name).toBe('John')
  })

  it('should handle array field paths', async () => {
    const form = useForm({
      defaultValues: {
        tags: [''],
      },
    })

    form.register('tags.0', { required: 'Tag required' })
    form.values.tags[0] = 'vue'

    await form.trigger('tags.0')
    await nextTick()

    expect(form.state.isValid).toBe(true)
    expect(form.values.tags[0]).toBe('vue')
  })

  it('should unregister field', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
        email: '',
      },
    })

    form.register('username')
    form.register('email')

    expect(form.control.names.mount).toContain('username')
    expect(form.control.names.mount).toContain('email')

    form.unregister('username')
    await nextTick()

    expect(form.control.names.mount).not.toContain('username')
    expect(form.control.names.mount).toContain('email')
  })

  it('should handle disabled form', () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      disabled: true,
    })

    expect(form.state.disabled).toBe(true)
  })

  it('should handle validation mode - onSubmit', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onSubmit',
    })

    form.register('username', { required: 'Required' })
    form.values.username = ''

    await form.trigger('username')
    await nextTick()

    // In onSubmit mode, validation should still work when triggered manually
    expect(form.errors.username).toBeDefined()
  })

  it('should handle validation mode - onChange', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onChange',
    })

    form.register('username', { required: 'Required' })
    const registerProps = form.register('username')

    form.values.username = ''
    registerProps.onChange({ target: { value: '', name: 'username' } })
    await nextTick()

    expect(form.errors.username).toBeDefined()
  })

  it('should handle validation mode - onBlur', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
      mode: 'onBlur',
    })

    form.register('username', { required: 'Required' })
    const registerProps = form.register('username')

    form.values.username = ''
    registerProps.onBlur({ target: { value: '', name: 'username' } })
    await form.trigger('username')

    expect(form.errors.username).toBeDefined()
  })

  it('should track submit count', async () => {
    const form = useForm({
      defaultValues: {
        username: '',
      },
    })

    form.register('username', { required: 'Required' })
    form.values.username = 'test'

    const handleSubmit = form.handleSubmit(vi.fn())

    expect(form.state.submitCount).toBe(0)

    await handleSubmit({ preventDefault: vi.fn() })
    await nextTick()

    expect(form.state.submitCount).toBe(1)

    await handleSubmit({ preventDefault: vi.fn() })
    await nextTick()

    expect(form.state.submitCount).toBe(2)
  })

  it('should handle async default values', async () => {
    const form = useForm({
      defaultValues: async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return {
          username: 'async',
        }
      },
    })

    expect(form.state.isLoading).toBe(true)

    // Wait for async default values to resolve
    await new Promise(resolve => setTimeout(resolve, 50))
    await nextTick()

    expect(form.state.isLoading).toBe(false)
    expect(form.values.username).toBe('async')
  })

  it('should handle controlled values', () => {
    const form = useForm({
      values: { username: 'controlled' },
      defaultValues: {
        username: '',
      },
    })
    expect(form.values.username).toBe('controlled')
  })
})
