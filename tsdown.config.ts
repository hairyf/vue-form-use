import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/resolver/yup.ts',
    'src/resolver/superstruct.ts',
    'src/resolver/joi.ts',
    'src/resolver/zod.ts',
  ],
  dts: true,
  exports: true,
})
