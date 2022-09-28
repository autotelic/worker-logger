import { Logger } from './lib/logger/index.js'
import { consoleReporter } from './lib/reporters/consoleReporter.js'
import { createSeqReporter } from './lib/reporters/seqReporter.js'
import { createLoggableEventHandler } from './lib/loggableEventHandler/index.js'
import { createPapertrailHttpReporter } from './lib/reporters/papertrailHttpReporter.js'
import { processMessage as convertToSyslog } from './lib/syslogConvertor/rfc5424.js'

export {
  Logger,
  createSeqReporter,
  consoleReporter,
  createLoggableEventHandler,
  createPapertrailHttpReporter,
  convertToSyslog
}
