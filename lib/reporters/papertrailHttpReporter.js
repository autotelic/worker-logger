import { processMessage } from '../syslogConvertor/rfc5424.js'
import { consoleReporter } from '../reporters/consoleReporter.js'

export const createPapertrailHttpReporter = (token, fetchClient, extraData = {}) => {
  return async logQueue => {
    const batch = logQueue.map(msgObject => {
      return processMessage({ ...msgObject, ...extraData })
    }).join('\n')

    return fetchClient('https://logs.collector.solarwinds.com/v1/logs', {
      body: batch,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Basic ${btoa(':' + token)}`
      }
    }).then(response => {
      if (response.status !== 200) {
        consoleReporter({ level: 50, msg: response.statusText })
      }
    }).catch(error => {
      consoleReporter({ level: 50, msg: error })
    })
  }
}
