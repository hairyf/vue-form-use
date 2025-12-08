import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useForm } from '../../src'

describe('form Validation', () => {
  describe('built-in Validation', () => {
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

      expect(form.errors.username?.message).toBe('Username is required')
      expect(form.errors.username?.type).toBe('required')
    })

    it('should validate min value', async () => {
      const form = useForm({
        defaultValues: {
          age: 0,
        },
        mode: 'onChange',
      })

      form.register('age', {
        min: {
          value: 18,
          message: 'Must be at least 18',
        },
      })

      form.values.age = 15
      await form.trigger('age')
      await nextTick()

      expect(form.errors.age?.message).toBe('Must be at least 18')
    })

    it('should validate max value', async () => {
      const form = useForm({
        defaultValues: {
          age: 0,
        },
        mode: 'onChange',
      })

      form.register('age', {
        max: {
          value: 100,
          message: 'Must be at most 100',
        },
      })

      form.values.age = 150
      await form.trigger('age')
      await nextTick()

      expect(form.errors.age?.message).toBe('Must be at most 100')
    })

    it('should validate multiple rules', async () => {
      const form = useForm({
        defaultValues: {
          password: '',
        },
        mode: 'onChange',
      })

      form.register('password', {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
        pattern: {
          value: /[A-Z]/,
          message: 'Password must contain uppercase letter',
        },
      })

      form.values.password = 'short'
      await form.trigger('password')
      await nextTick()

      expect(form.errors.password?.message).toBe('Password must be at least 8 characters')
    })

    it('should validate with custom function returning string', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', {
        validate: (value) => {
          if (value.length < 3) {
            return 'Username must be at least 3 characters'
          }
          return true
        },
      })

      form.values.username = 'ab'
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username?.message).toBe('Username must be at least 3 characters')
    })

    it('should validate with custom function returning boolean', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', {
        validate: value => value.length >= 3 || 'Username must be at least 3 characters',
      })

      form.values.username = 'ab'
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username?.message).toBe('Username must be at least 3 characters')
    })

    it('should validate with multiple custom validators', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', {
        validate: {
          minLength: value => value.length >= 3 || 'Min 3 characters',
          noSpaces: value => !value.includes(' ') || 'No spaces allowed',
        },
      })

      form.values.username = 'ab'
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username?.message).toBe('Min 3 characters')

      form.values.username = 'a b'
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username?.message).toBe('No spaces allowed')
    })

    it('should validate async custom function', async () => {
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

    it('should clear error when validation passes', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', {
        required: 'Required',
        minLength: {
          value: 3,
          message: 'Min 3 characters',
        },
      })

      form.values.username = ''
      await form.trigger('username')
      await nextTick()
      expect(form.errors.username).toBeDefined()

      form.values.username = 'valid'
      await form.trigger('username')
      await nextTick()
      expect(form.errors.username).toBeUndefined()
    })
  })

  describe('validation Modes', () => {
    it('should validate on change when mode is onChange', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', { required: 'Required' })
      const registerProps = form.register('username')

      registerProps.onChange({ target: { value: '', name: 'username' } })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })

    it('should validate on blur when mode is onBlur', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onBlur',
      })

      form.register('username', { required: 'Required' })
      const registerProps = form.register('username')

      registerProps.onBlur({ target: { value: '', name: 'username' } })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })

    it('should validate on submit when mode is onSubmit', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Required' })
      const registerProps = form.register('username')

      registerProps.onChange({ target: { value: '', name: 'username' } })
      await nextTick()

      // Should not validate on change in onSubmit mode
      expect(form.errors.username).toBeUndefined()

      // Should validate on submit
      const handleSubmit = form.handleSubmit(() => {})
      await handleSubmit({ preventDefault: () => {} })
      await nextTick()

      expect(form.errors.username).toBeDefined()
    })
  })

  describe('trigger Validation', () => {
    it('should trigger validation for single field', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
          email: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Username required' })
      form.register('email', { required: 'Email required' })

      form.values.username = ''
      await form.trigger('username')
      await nextTick()

      expect(form.errors.username).toBeDefined()
      expect(form.errors.email).toBeUndefined()
    })

    it('should trigger validation for multiple fields', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
          email: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Username required' })
      form.register('email', { required: 'Email required' })

      form.values.username = ''
      form.values.email = ''
      await form.trigger(['username', 'email'])
      await nextTick()

      expect(form.errors.username).toBeDefined()
      expect(form.errors.email).toBeDefined()
    })

    it('should trigger validation for all fields', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
          email: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Username required' })
      form.register('email', { required: 'Email required' })

      form.values.username = ''
      form.values.email = ''
      await form.trigger()
      await nextTick()

      expect(form.errors.username).toBeDefined()
      expect(form.errors.email).toBeDefined()
    })

    it('should return validation result', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onSubmit',
      })

      form.register('username', { required: 'Required' })

      form.values.username = ''
      const isValid = await form.trigger('username')
      await nextTick()

      expect(isValid).toBe(false)

      form.values.username = 'valid'
      const isValid2 = await form.trigger('username')
      await nextTick()

      expect(isValid2).toBe(true)
    })
  })

  describe('form State Validation', () => {
    it('should track isValid state', async () => {
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

      form.values.username = 'valid'
      await form.trigger('username')
      await nextTick()

      expect(form.state.isValid).toBe(true)
    })

    it('should track isValidating state', async () => {
      const form = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onChange',
      })

      form.register('username', {
        validate: async (value) => {
          await new Promise(resolve => setTimeout(resolve, 50))
          return value.length >= 3 || 'Min 3 characters'
        },
      })

      form.values.username = 'ab'
      const triggerPromise = form.trigger('username')

      // Check during validation
      expect(form.state.isValidating).toBe(true)
      expect(form.state.fields.username.isValidating).toBe(true)

      await triggerPromise
      await nextTick()

      expect(form.state.isValidating).toBe(false)
      expect(form.state.fields.username.isValidating).toBe(false)
    })
  })
})
