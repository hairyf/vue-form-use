import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import * as yup from 'yup'
import { useForm } from '../../src'
import { yupResolver } from '../../src/resolver/yup'

describe('resolvers', () => {
  describe('yupResolver', () => {
    it('should validate with yup schema', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
      })

      const form = useForm({
        defaultValues: {
          name: '',
          email: '',
        },
        resolver: yupResolver(schema),
      })

      form.register('name')
      form.register('email')

      const handleSubmit = form.handleSubmit(() => {})
      await handleSubmit({ preventDefault: () => {} })
      await nextTick()

      expect(form.errors.name?.message).toBe('Name is required')
      expect(form.errors.email?.message).toBe('Email is required')
    })

    it('should pass validation with valid data', async () => {
      const schema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
      })

      const form = useForm({
        defaultValues: {
          name: '',
          email: '',
        },
        resolver: yupResolver(schema),
      })

      form.register('name')
      form.register('email')

      form.values.name = 'John Doe'
      form.values.email = 'john@example.com'

      const onSubmit = vi.fn()
      const handleSubmit = form.handleSubmit(onSubmit)
      await handleSubmit({ preventDefault: () => {} })
      await nextTick()

      expect(onSubmit).toHaveBeenCalledWith(
        { name: 'John Doe', email: 'john@example.com' },
        expect.any(Object),
      )
      expect(form.state.isSubmitSuccessful).toBe(true)
    })

    it('should transform values with yup schema', async () => {
      const schema = yup.object({
        age: yup.string().transform(value => Number(value)),
      })

      const form = useForm({
        defaultValues: {
          age: '',
        },
        resolver: yupResolver(schema),
      })

      form.register('age')
      form.values.age = '25'

      const onSubmit = vi.fn()
      const handleSubmit = form.handleSubmit(onSubmit)
      await handleSubmit({ preventDefault: () => {} })
      await nextTick()

      expect(onSubmit).toHaveBeenCalledWith(
        { age: 25 },
        expect.any(Object),
      )
    })

    it('should handle nested schema', async () => {
      const schema = yup.object({
        user: yup.object({
          name: yup.string().required('Name is required'),
          email: yup.string().email('Invalid email').required('Email is required'),
        }),
      })

      const form = useForm({
        defaultValues: {
          user: {
            name: '',
            email: '',
          },
        },
        resolver: yupResolver(schema),
      })

      form.register('user.name')
      form.register('user.email')

      const handleSubmit = form.handleSubmit(() => {})
      await handleSubmit({ preventDefault: () => {} })
      await nextTick()

      expect(form.errors.user?.name?.message).toBe('Name is required')
      expect(form.errors.user?.email?.message).toBe('Email is required')
    })

    it('should validate on trigger', async () => {
      const schema = yup.object({
        email: yup.string().email('Invalid email').required('Email is required'),
      })

      const form = useForm({
        defaultValues: {
          email: '',
        },
        resolver: yupResolver(schema),
      })

      form.register('email')
      form.values.email = 'invalid-email'

      await form.trigger('email')
      await nextTick()

      expect(form.errors.email?.message).toBe('Invalid email')
    })
  })
})
