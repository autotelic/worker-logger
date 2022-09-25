export const createPapertrailHttpReporter = (papertrailEndpoint, token, fetchClient) => {
  return async logQueue => {
    const batch = logQueue.map(logEvent => JSON.stringify(logEvent)).join('\n')
    return fetchClient(`${papertrailEndpoint}`, {
      body: batch,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Basic ${btoa(':' + token)}`
      }
    })
  }
}
