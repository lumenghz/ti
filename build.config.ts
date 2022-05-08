import { defineBuildConfig } from 'unbuild'
import { sync } from 'fast-glob'

export default defineBuildConfig({
  entries: [
    ...sync('src/bin/*.ts').map(e => e.slice(0, -3)),
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
