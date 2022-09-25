export const createPapertrailHttpReporter = (token, fetchClient) => {
  return async logQueue => {
    const batch = logQueue.map(logEvent => JSON.stringify(logEvent)).join('\n')
    return fetchClient('https://logs.collector.solarwinds.com/v1/logs', {
      body: batch,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Basic ${btoa(':' + token)}`
      }
    })
  }
}
