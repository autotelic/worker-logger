/* global Request */
import { Logger } from '../logger/index.js'

export const createLoggableEventHandler = ({
  router,
  logOptions,
  logger
}) => {
  const logHandler = logger === undefined
    ? new Logger(logOptions)
    : logger
  return async event => {
    const request = new Request(event.request)
    request.log = logHandler.log
    const res = await router.handle(request, event)
    event.waitUntil(logHandler.report())
    return res
  }
}
