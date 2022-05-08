import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { exit } from 'process'
import { parse } from 'yaml'

const configHome = process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME
const yamlPath = join(configHome || '~/', '.config', 'ti', 'config.yaml')

export interface TiConfig {
  version: string | '1'
  tasks: TiTask[]
}

export interface TiTask {
  name: string
  cmds: string[]
  cwd?: string
}

export function getConfig(): TiConfig {
  if (!existsSync(yamlPath)) {
    console.log(`Config file not found at ${yamlPath}`)
    exit(1)
  }

  return parse(readFileSync(yamlPath, 'utf8'))
}
