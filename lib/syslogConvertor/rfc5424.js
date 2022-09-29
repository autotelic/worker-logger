import stringify from 'fast-safe-stringify'
import moment from 'moment-timezone'

const severity = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
}

function levelToSeverity(level) {
  let result
  switch (level) {
    case 10: // pino: trace
      result = severity.debug
      break
    case 20: // pino: debug
      result = severity.debug
      break
    case 30: // pino: info
      result = severity.info
      break
    case 40: // pino: warn
      result = severity.warning
      break
    case 50: // pino: error
      result = severity.error
      break
    case 60: // pino: fatal
    default:
      result = severity.critical
      break
  }
  return result
}

const defaults = {
  appname: 'none',
  cee: false,
  facility: 16,
  includeProperties: [],
  messageOnly: false,
  tz: 'Etc/UTC',
  newline: false,
  structuredData: '-'
}

export const processMessage = (data, options = defaults) => {
  function buildMessage(data) {
    let message = {}
    if (options.messageOnly) {
      message = data.msg
      return message
    }

    if (options.includeProperties.length > 0) {
      options.includeProperties.forEach((p) => { message[p] = data[p] })
      message = stringify(message)
    } else {
      message = stringify(data)
    }

    return message
  }

  const version = 1
  const severity = levelToSeverity(data.level)
  const pri = (8 * options.facility) + severity
  const tstamp = moment(data.time).tz(options.tz).format().toUpperCase()
  const hostname = data.hostname
  const appname = (options.appname !== 'none') ? options.appname : '-'
  const msgid = (data.req && data.req.id) ? data.req.id : '-'
  const structuredData = options.structuredData || '-'
  const header = `<${pri}>${version} ${tstamp} ${hostname} ${appname} ${data.pid} ${msgid} ${structuredData} `
  const message = buildMessage(data)
  return (options.cee && !options.messageOnly)
    ? `${header}@cee: ${message}${options.newline ? '\n' : ''}`
    : `${header}${message}${options.newline ? '\n' : ''}`
}
