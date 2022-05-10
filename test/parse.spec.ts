import { expect, test } from 'vitest'
import type { TiCmd } from '../src/config'
import { parseCommand } from '../src/parse'

test('Test parse simple command', async () => {
  const tiCmd = {
    type: 'exec',
    value: 'echo hello',
  } as TiCmd
  const command = await parseCommand(tiCmd)
  expect(command).toBe('echo hello')
})
