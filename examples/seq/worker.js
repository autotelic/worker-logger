import { Logger, createSeqReporter } from '../../index.js'

const reporter = createSeqReporter('http://localhost:5341', fetch)
const log = new Logger({ reporter })

addEventListener('fetch', event => { // eslint-disable-line no-undef
  event.respondWith(handleEvent(event))
})

async function handleEvent (event) {
  log.info('hello logger')
  const response = new Response('Hello worker!', { // eslint-disable-line no-undef
    headers: { 'content-type': 'text/plain' }
  })
  log.info('response constructed')
  event.waitUntil(log.report())
  return response
}
