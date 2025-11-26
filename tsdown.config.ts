import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/resolver/yup.ts',
  ],
  dts: true,
  exports: true,
})
