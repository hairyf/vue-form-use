import type { FieldValues } from './struct'
import type { DeepPartial } from './utils'

export type DefaultValues<Values extends FieldValues> = Values extends AsyncDefaultValues<Values> ? DeepPartial<Awaited<Values>> : DeepPartial<Values>
export type AsyncDefaultValues<Values extends FieldValues> = (payload?: unknown) => Promise<Values>
