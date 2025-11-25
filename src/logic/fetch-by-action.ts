import { getSubmissionType } from './get-submission-type'
import { stringifyData } from './stringify-data'

export async function fetchByAction(props: {
  action: string
  data: any
  method?: string
  encType?: string
  headers?: Record<string, string>
}): Promise<Response> {
  const submissionType = getSubmissionType([
    props.headers?.['Content-Type'],
    props.encType,
  ])
  const body = stringifyData(submissionType, props.data)
  const response = await fetch(props.action, {
    method: props.method,
    headers: {
      ...props.headers,
      ...(props.encType && props.encType !== 'multipart/form-data'
        ? { 'Content-Type': props.encType }
        : {}),
    },
    body,
  })

  return response
}
