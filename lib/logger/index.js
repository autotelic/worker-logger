import { consoleReporter } from '../reporters/consoleReporter.js'

const LEVEL_NAMES = {
  10: 'trace',
  20: 'debug',
  30: 'info',
  40: 'warn',
  50: 'error',
  60: 'fatal'
}

const defaultTransport = {
  reporter: consoleReporter,
  level: 'info',
  batch: false
}

class Logger {
  constructor({ transports = [defaultTransport] }) {
    const { batchTransports, queueTransports } = transports.reduce((groups, transport) => {
      const { batch = true, reporter, level = 'info' } = transport
      batch === false
        ? groups.queueTransports.push({ reporter, level })
        : groups.batchTransports.push({ reporter, level })
      return groups
    }, {
      batchTransports: [],
      queueTransports: []
    })

    this.batchTransports = batchTransports
    this.queueTransports = queueTransports
    this.queue = []
  }

  enqueue(levelNum, msg) {
    const asClef = {
      '@t': new Date().toISOString(),
      '@m': msg,
      '@l': LEVEL_NAMES[levelNum]
    }
    this.queueTransports.forEach(({ reporter, level }) => {
      if (levelNum >= this.getLevelNumberByName(level)) {
        reporter(asClef)
      }
    })
    this.queue.push(asClef)
  }

  getLevelNumberByName(levelName) {
    return Number(Object.keys(LEVEL_NAMES).find(levelNum => LEVEL_NAMES[levelNum] === levelName))
  }

  fatal(msg) {
    this.enqueue(60, msg)
  }

  error(msg) {
    this.enqueue(50, msg)
  }

  warn(msg) {
    this.enqueue(40, msg)
  }

  info(msg) {
    this.enqueue(30, msg)
  }

  debug(msg) {
    this.enqueue(20, msg)
  }

  trace(msg) {
    this.enqueue(10, msg)
  }

  report() {
    this.batchTransports.forEach(
      ({ reporter, level }) => {
        const filteredQueue = this.queue.filter(logEvent => {
          return this.getLevelNumberByName(logEvent['@l']) >= this.getLevelNumberByName(level)
        })
        reporter(filteredQueue)
      }
    )
  }
}

export { Logger }
