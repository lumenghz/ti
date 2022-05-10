import { expect, test } from 'vitest'
import { getConfig } from '../src/config'

test('No configuration files test', () => {
  expect(() => {
    getConfig()
  }).toThrow(/^Config file not found:.*?$/)
})
