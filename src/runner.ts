import { type SyncOptions, execaCommandSync } from 'execa'
import prompts, { type Answers } from 'prompts'
import { Fzf } from 'fzf'
import { parseCommand } from './parse'
import type { TiConfig, TiTask } from './config'

function getTask(config: TiConfig, name: string): TiTask {
  for (const task of config.tasks) {
    if (task.name === name)
      return task
  }
  // it should never reach here
  process.exit(1)
}

export function runTi(config: TiConfig): void {
  const choices = config.tasks.map(task => ({ title: task.name, value: task }))
  const fzf = new Fzf(choices.map(choice => choice.title))

  prompts({
    type: 'autocomplete',
    name: 'task',
    message: 'Select a task',
    choices,
    suggest: (input: string) => Promise.resolve(fzf.find(input).map(item => item.item)),
  }).then(async (answer: Answers<'task'>) => {
    const task = getTask(config, answer.task)

    try {
      for (const cmd of task.cmds) {
        let options: SyncOptions = { encoding: 'utf8', stdio: 'inherit', cwd: task.cwd }
        if (cmd.type === 'shell')
          options = { ...options, shell: true }
        if (task.env)
          options = { ...options, env: { ...process.env, ...task.env } }

        const command = await parseCommand(cmd)
        execaCommandSync(command, options)
      }
    }
    catch (e) {
      if (config.debug === true)
        console.error(e)
    }
  })
}
