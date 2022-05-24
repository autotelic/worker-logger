import { Logger } from '../../index.js'

// this is a reporter for Seq https://docs.datalust.co/docs/posting-raw-events
const reporter = async logQueue => {
  const batch = logQueue.map(logEvent => JSON.stringify(logEvent)).join('\n')
  return fetch('http://localhost:5341/api/events/raw', {
    body: batch,
    method: 'POST',
    headers: {
      'content-type': 'application/vnd.serilog.clef',
    }
  })
}

const log = new Logger({ reporter })

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event));
})

async function handleEvent(event) {
  log.info('hello logger')
  const response = new Response('Hello worker!', {
    headers: { 'content-type': 'text/plain' },
  })
  log.info('response constructed')
  event.waitUntil(log.report())
  return response
}
