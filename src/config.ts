import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { parse as parseYaml } from 'yaml'

const configHome = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
const yamlPath = join(configHome || '~/', '.config', 'ti', 'config.yaml')

export interface TiConfig {
  version: string | '1'
  tasks: TiTask[]
}

export interface TiCmd {
  type: 'exec' | 'shell'
  value: string
}

export interface TiTask {
  name: string
  cmds: TiCmd[]
  cwd?: string
}

export function getConfig(): TiConfig {
  if (!existsSync(yamlPath))
    throw new Error(`Config file not found: ${yamlPath}`)

  const config = parseYaml(readFileSync(yamlPath, 'utf8'))
  const tasks = config.tasks.map((task: any) => {
    const cmds = task.cmds.map((cmd: any) => {
      if (typeof cmd === 'string')
        return { type: 'exec', value: cmd }

      return cmd
    })
    task.cmds = cmds
    if (!task.cwd)
      task.cwd = process.cwd()

    return task
  }) as TiTask[]
  config.tasks = tasks
  return config
}
