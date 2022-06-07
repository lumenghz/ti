import type { TiConfig } from '../config'
import { getConfig } from '../config'
import { runTi } from '../runner'

const config: TiConfig = getConfig()
if (config === null || config === undefined)
  process.exit(1)

runTi(config)
