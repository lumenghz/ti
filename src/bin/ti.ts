import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { getConfig } from '../config'
import { listTi, runTi } from '../runner'

const options = yargs(hideBin(process.argv))
  .scriptName('ti')
  .command('list', 'Show configured task list', { list: { default: true } })
  .help('h')
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .showHelpOnFail(true)
  .strictCommands(true)
  .strictOptions(true)
  .locale('en')
  .showHelpOnFail(true)
  .parseSync()

const config = getConfig()
if (config === null || config === undefined)
  process.exit(1)

if (options.list)
  listTi(config)
else
  runTi(config)
