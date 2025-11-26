export interface Transformer<Serialized = any, Parsed = any> {
  input: (value: Serialized) => Parsed
  output: (value: Parsed) => Serialized
}
