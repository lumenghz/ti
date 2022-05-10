import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { initDefaultConfig } from '../config'
import { runTi } from '../runner'

const args = yargs(hideBin(process.argv))
  .command('init', 'Initialize a configuration file with a simple task', () => {}, () => {
    initDefaultConfig()
  })
  .help('h')
  .alias('h', 'help')
  .parseSync()

if (args._.length > 0) // just ignore...
  process.exit(0)

runTi()
