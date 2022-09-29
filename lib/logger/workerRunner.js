/* global logMessage, Response, logOptions, addEventListener */
import { ThrowableRouter } from 'itty-router-extras'
import { Logger } from './index.js'

const router = ThrowableRouter()
router.get('*', request => {
  const logger = new Logger({
    transports: [
      { reporter: batchReporter },
      { reporter: queueReporter, batch: false },
      { reporter: debugReporter, level: 'debug'}
    ]
  })
  logger.log.info('log info')
  logger.log.debug('log debug')
  logger.log.warn('log warn')
  logger.log.error('log error')
  logger.log.fatal('log fatal')
  logger.report()
  return new Response('Wrapped Handler')
})

addEventListener('fetch', event => event.respondWith(router.handle(event.request)))
