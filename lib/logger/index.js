import pino from 'pino'
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
  batch: false
}

class Logger {
  constructor ({ transports = [defaultTransport] }) {
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

    this.log = pino({
      browser: {
        write: msgObject => {
          this.enqueue(msgObject)
        }
      }
    })
    this.batchTransports = batchTransports
    this.queueTransports = queueTransports
    this.queue = []
  }

  enqueue (msgObject) {
    const { level: levelNum } = msgObject
    this.queueTransports.forEach(({ reporter, level }) => {
      if (levelNum >= this.getLevelNumberByName(level)) {
        reporter(msgObject)
      }
    })
    this.queue.push(msgObject)
  }

  getLevelNumberByName (levelName) {
    return Number(Object.keys(LEVEL_NAMES).find(levelNum => LEVEL_NAMES[levelNum] === levelName))
  }

  report () {
    this.batchTransports.forEach(
      ({ reporter, level }) => {
        const filteredQueue = this.queue.filter(({ level: levelNum }) => {
          return levelNum >= this.getLevelNumberByName(level)
        })
        reporter(filteredQueue)
      }
    )
  }
}

export { Logger }
