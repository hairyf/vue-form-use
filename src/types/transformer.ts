export interface Transformer<V, R = any> {
  input: (values: V) => R
  output: (values: R) => V
}
