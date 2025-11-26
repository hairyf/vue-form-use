import type { HandleSubmit, SubmitErrorHandler, SubmitHandler, UseControlContext } from '../types'
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

      state.isSubmitting = true

      if (props.resolver) {
        const { values, errors } = await _runSchema()
        _updateStateErrors(errors)
        fieldValues = values
      }
      else {
        await _executeBuiltInValidation()
        _updateStateErrors(state.errors)
        fieldValues = values.value
      }

      fieldValues = deepClone(fieldValues)

      // TODO: Disable fields
      // if (names.disabled.size) {
      //   for (const name of names.disabled) {
      //     unset(values, name);
      //   }
      // }

      unset(state.errors, 'root')

      if (state.isValid) {
        try {
          await onValid(fieldValues, e)
        }
        catch (error) {
          onValidError = error
        }
      }
      else {
        if (onInvalid)
          await onInvalid({ ...state.errors }, e)
        _focusError()
        setTimeout(_focusError)
      }

      state.isSubmitting = false
      state.isSubmitted = true
      state.isSubmitSuccessful = state.isValid
      state.submitCount++

      if (onValidError)
        throw onValidError
    }
  }

  return { handleSubmit: handleSubmit as HandleSubmit<any> }
}
