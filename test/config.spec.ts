import { describe, expect, test, vi } from 'vitest'
import { getConfig } from '../src/config'

describe('Parse config', () => {
  test('Config file not found', () => {
    vi.mock('globby')
    expect(() => {
      getConfig()
    }).toThrow(/^Config file not found in .*?$/)
    vi.unmock('globby')
  })

  test('Get config from config.yml', () => {
    testGetConfig('config.yml')
  })

  test('Get config from config.yaml', () => {
    testGetConfig('config.yaml')
  })
})

function testGetConfig(filename: string) {
  vi.mock('globby')
  process.env.MOCK_CONFIG_FILE = filename
  const config = getConfig()
  expect(config !== null).toBeTruthy()
  expect(config.version).toBe('1')
  expect(config.tasks.length).greaterThan(0)
  vi.unmock('globby')
}
