import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { sync as syncGlob } from 'fast-glob'

const userHome = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
const tiConfigHome = join(userHome || '~/', '.config', 'ti')

export interface TiConfig {
  version: string | '1'
  tasks: TiTask[]
}

export type TiCmdParams<K extends string, T> = {
  [P in K]: T
}

export interface TiCmdParam {
  type: 'select' | 'text'
  choices: string[] | []
}

export interface TiCmd {
  type: 'exec' | 'shell'
  value: string
  params?: TiCmdParams<string, TiCmdParam>
}

export interface TiTask {
  name: string
  cmds: TiCmd[]
  cwd?: string
}

function getConfigFilepath(): string {
  const candidates = syncGlob(join(tiConfigHome, 'config.y?(a)ml'), { absolute: true })
  if (candidates.length === 0)
    throw new Error(`Config file not found in ${tiConfigHome}`)

  // take the first one
  return candidates[0]
}

export function getConfig(): TiConfig {
  const yamlPath = getConfigFilepath()
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

/**
 * Create a simple ti configuration file.
 */
export function initDefaultConfig(): void {
  const configFilepath = join(tiConfigHome, 'config.yaml')
  if (existsSync(configFilepath)) {
    console.warn(`Configuration file ${configFilepath} already exists.`)
    return
  }

  const content = stringifyYaml(
    {
      version: '1',
      tasks: [
        {
          name: 'hello world',
          cmds: [
            'echo hello world',
          ],
        },
      ],
    },
    { singleQuote: true },
  )
  mkdirSync(dirname(configFilepath), { recursive: true })
  writeFileSync(configFilepath, content, { encoding: 'utf8' })
}
