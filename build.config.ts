import { defineBuildConfig } from 'unbuild'
import { globbySync } from 'globby'

export default defineBuildConfig({
  entries: [
    ...globbySync('src/bin/*.ts').map(e => e.slice(0, -3)),
  ],
  clean: true,
  declaration: true,
  replace: {
    'import.meta.vitest': 'undefined',
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
