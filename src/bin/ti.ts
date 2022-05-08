import { exit } from 'process'
import type { Answers } from 'prompts'
import prompts from 'prompts'
import { execaCommandSync } from 'execa'
import type { TiConfig, TiTask } from '../config'
import { getConfig } from '../config'

const config: TiConfig = getConfig()
if (config === null || config === undefined)
  exit(1)

function getTask(name: string): TiTask {
  for (const task of config.tasks) {
    if (task.name === name)
      return task
  }
  // it should never reach here
  exit(1)
}

prompts({
  type: 'autocomplete',
  name: 'task',
  message: 'Select a task',
  choices: config.tasks.map(task => ({ title: task.name, value: task })),
}).then((answer: Answers<'task'>) => {
  const task = getTask(answer.task.name)
  try {
    execaCommandSync(task.cmds.join(' && '), { shell: true, stdio: 'inherit', cwd: task.cwd })
  }
  catch (e) {
    console.error(e)
  }
})
