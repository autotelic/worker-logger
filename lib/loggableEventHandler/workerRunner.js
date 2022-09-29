/* global Response, Logger, logInfo, report, addEventListener */
import { ThrowableRouter } from 'itty-router-extras'
import { createLoggableEventHandler } from './index.js'

const router = ThrowableRouter()
router.get('*', request => {
  request.log.info('info log')
  return new Response('Wrapped Handler')
})

const eventHandler = createLoggableEventHandler({ router, logger: new Logger(logInfo, report) })

addEventListener('fetch', event => event.respondWith(eventHandler(event)))
