const consoleReporter = async queue => {
  queue.forEach(logEvent => console.log(`${logEvent['@l']}: ${logEvent['@m']}`))
}

const createSeqReporter = (seqHost, fetchClient) => {
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

class Logger {
  constructor ({ reporter = consoleReporter }) {
    this.reporter = reporter
    this.queue = []
  }

  enqueue (level, msg) {
    this.queue.push({
      '@t': new Date().toISOString(),
      '@m': msg,
      '@l': level
    })
  }

  info (msg) {
    this.enqueue('INFO', msg)
  }

  report () {
    return this.reporter(this.queue)
  }
}

export {
  Logger,
  createSeqReporter
}
