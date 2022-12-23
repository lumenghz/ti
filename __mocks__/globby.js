const { resolve } = require('path')

export function globbySync() {
  if (process.env.MOCK_CONFIG_FILE !== undefined)
    return [resolve(__dirname, `../test/${process.env.MOCK_CONFIG_FILE}`)]
  return []
}
