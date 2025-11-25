export function getSubmissionType(types: any[]): 'json' | 'form-data' {
  return types.some(type => type && type.includes('json')) ? 'json' : 'form-data'
}
