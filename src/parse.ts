import type { PromptObject } from 'prompts'
import prompts from 'prompts'
import type { TiCmd, TiCmdParam, TiCmdParams } from './config'

/**
 * Parse complex TiCmd config to a simple, executable command
 * @param cmd A TiCmd instance
 * @returns executable command string
 */
export async function parseCommand(cmd: TiCmd): Promise<string> {
  let command = cmd.value
  if (/\$\(\?([a-z]+)\)/.test(cmd.value)) { // has params
    const matches = Array.from(cmd.value.matchAll(/\$\(\?([a-z]+)\)/g))
    const params = cmd.params || {}

    const questions = parsePromptQuestions(matches.map(match => match[1]), params)
    const answer = await prompts(questions, { onCancel: () => process.exit() })

    for (const match of matches) {
      const name = match[1]
      command = command.replace(match[0], answer[name])
    }
  }
  return command
}

function parsePromptQuestions(paramNames: string[], params: TiCmdParams<string, TiCmdParam>): PromptObject[] {
  const questions: PromptObject[] = []
  for (const name of paramNames) {
    // use type: 'text' by default
    const param: TiCmdParam = params[name] || { type: 'text' }
    if (param.type === 'select')
      questions.push(parseSelect(name, param))
    else if (param.type === 'text')
      questions.push(parseText(name))
  }

  return questions
}

function parseSelect(name: string, param: TiCmdParam): PromptObject {
  return {
    type: 'select',
    name,
    message: `Select ${name}`,
    choices: param.choices.map(choice => ({ title: choice, value: choice })),
  } as PromptObject
}

function parseText(name: string): PromptObject {
  return {
    type: 'text',
    name,
    message: `Input ${name}`,
  } as PromptObject
}
