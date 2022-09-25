// TODO: prettify & colorize
export const consoleReporter = logEvent => console.log(
  `${logEvent['@l'].toUpperCase()}: ${logEvent['@m']}`
)
