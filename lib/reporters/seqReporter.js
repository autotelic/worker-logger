export const createSeqReporter = (seqHost, fetchClient) => {
  return async logQueue => {
    const batch = logQueue.map(logEvent => JSON.stringify(logEvent)).join('\n')
    return fetchClient(`${seqHost}/api/events/raw`, {
      body: batch,
      method: 'POST',
      headers: {
        'content-type': 'application/vnd.serilog.clef'
      }
    })
  }
}
