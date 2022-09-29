import { LEVEL_NAMES } from '../consts.js'

export const createSeqReporter = (seqHost, fetchClient) => {
  return async logQueue => {
    const batch = logQueue.map(({ time, level, msg }) => {
      return JSON.stringify({
        '@t': new Date(time).toISOString(),
        '@m': msg,
        '@l': LEVEL_NAMES[level]
      })
    }).join('\n')
    return fetchClient(`${seqHost}/api/events/raw`, {
      body: batch,
      method: 'POST',
      headers: {
        'content-type': 'application/vnd.serilog.clef'
      }
    })
  }
}
