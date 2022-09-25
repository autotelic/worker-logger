# worker-logger

A simple log handler for cloudflare workers.

Workers have limits on [subrequests][subrequests] and [simultaneous open connections][simultaneous-open-connections],
so if we are logging via http to an external service we want to batch log requests.

This logger creates a queue, and provides log level methods and a `report` method.
Each log level method enqueues the message in [CLEF][clef] format, `report`
processes the queue of log messages by calling
the configured reporter.

## Installation

```
npm install --save @autotelic/worker-logger
```

## Usage

```js
import { Logger, createSeqReporter } from '@autotelic/worker-logger'

// this creates a reporter for posting to Seq https://docs.datalust.co/docs/posting-raw-events
// pass in the global fetch of the worker
const seqReporter = createSeqReporter('http://localhost:5341', fetch)


const log = new Logger(transports: [
  { reporter: seqReporter },
  { repoert: consoleReporter, batch: false },
])

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

```

[subrequests]: https://developers.cloudflare.com/workers/platform/limits/#subrequests
[simultaneous-open-connections]: https://developers.cloudflare.com/workers/platform/limits/#simultaneous-open-connections
[clef]: https://clef-json.org/
