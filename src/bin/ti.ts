import type { Answers } from 'prompts'
import prompts from 'prompts'
import type { SyncOptions } from 'execa'
import { execaCommandSync } from 'execa'
import type { TiConfig, TiTask } from '../config'
import { getConfig } from '../config'

const config: TiConfig = getConfig()
if (config === null || config === undefined)
  process.exit(1)

function getTask(name: string): TiTask {
  for (const task of config.tasks) {
    if (task.name === name)
      return task
  }
  // it should never reach here
  process.exit(1)
}

prompts({
  type: 'autocomplete',
  name: 'task',
  message: 'Select a task',
  choices: config.tasks.map(task => ({ title: task.name, value: task })),
}).then((answer: Answers<'task'>) => {
  const task = getTask(answer.task.name)
  try {
    for (const cmd of task.cmds) {
      let options: SyncOptions = { encoding: 'utf8', stdio: 'inherit', cwd: task.cwd }
      if (cmd.type === 'shell')
        options = { ...options, shell: true }

      execaCommandSync(cmd.value, options)
    }
  }
  catch (e) {
    console.error(e)
  }
})
