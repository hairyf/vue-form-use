import type { SubmitErrorHandler, SubmitHandler, UseControlContext } from '../types'
import { deepClone, unset } from '../utils'

// eslint-disable-next-line ts/explicit-function-return-type
export function useFormSubmit(context: UseControlContext) {
  const state = context.state!
  const props = context.options!
  const values = context.values!
  const _runSchema = context._runSchema!
  const _updateStateErrors = context._updateStateErrors!
  const _executeBuiltInValidation = context._executeBuiltInValidation!
  const _focusError = context._focusError!

  function handleSubmit(
    onValid: SubmitHandler<any>,
    onInvalid?: SubmitErrorHandler<any>,
  ): (e: any) => Promise<void> {
    return async (e: any) => {
      let onValidError

      if (e) {
        e.preventDefault?.()
        e.persist?.()
      }

      let fieldValues

      state.form.isSubmitting = true

      if (props.resolver) {
        const { values, errors } = await _runSchema()
        _updateStateErrors(errors)
        fieldValues = values
      }
      else {
        await _executeBuiltInValidation()
        _updateStateErrors(state.form.errors)
        fieldValues = values.value
      }

      fieldValues = deepClone(fieldValues)

      // TODO: Disable fields
      // if (names.disabled.size) {
      //   for (const name of names.disabled) {
      //     unset(values, name);
      //   }
      // }

      unset(state.form.errors, 'root')

      if (state.form.isValid) {
        try {
          await onValid(fieldValues, e)
        }
        catch (error) {
          onValidError = error
        }
      }
      else {
        if (onInvalid)
          await onInvalid({ ...state.form.errors }, e)
        _focusError()
        setTimeout(_focusError)
      }

      state.form.isSubmitting = false
      state.form.isSubmitted = true
      state.form.isSubmitSuccessful = state.form.isValid
      state.form.submitCount++

      if (onValidError)
        throw onValidError
    }
  }

  return { handleSubmit }
}
