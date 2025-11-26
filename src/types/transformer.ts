export interface Transformer<Parsed, Serialized = any> {
  input: (value: Serialized) => Parsed
  output: (value: Parsed) => Serialized
}
