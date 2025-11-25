export function stringifyData<T extends 'form-data' | 'json'>(
  type: T,
  data: any,
): T extends 'form-data' ? FormData : string {
  let value: any

  if (type === 'form-data') {
    value = new FormData()
  }
  else {
    try {
      value = JSON.stringify(data)
    }
    catch {
      value = ''
    }
  }
  return value
}
