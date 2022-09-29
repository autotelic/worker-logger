import { LEVEL_NAMES  } from '../consts.js'

// TODO: prettify & colorize
export const consoleReporter = ({ level, msg, time }) => console.log(
  `${LEVEL_NAMES[level].toUpperCase()}: ${msg}`
)
