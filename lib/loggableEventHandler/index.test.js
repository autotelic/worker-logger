import test from 'ava'
import sinon from 'sinon'
import { Miniflare } from 'miniflare'

test.beforeEach(async t => {
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = { clock }
})

test.afterEach(async t => {
  const { context } = t
  const { clock } = context
  clock.restore()
})

test('logger.log attached to request and logger.report called for request', async t => {
  const logInfo = sinon.spy()
  const report = sinon.spy()

  class Logger {
    constructor (info, report) {
      this.log = { info }
      this.report = report
    }
  }

  const outFile = './util/worker/dist/loggableEventHandler.js'

  const mf = new Miniflare({
    scriptPath: outFile,
    buildCommand: `npm run build-test -- --outfile=${outFile} out=./lib/loggableEventHandler/workerRunner.js`,
    globals: {
      Logger,
      logInfo,
      report
    }
  })

  const res = await mf.dispatchFetch('http://localhost:8787/', {})
  const text = await res.text()
  t.is(text, 'Wrapped Handler')

  t.true(logInfo.calledOnceWith('info log'))
  t.true(report.calledOnceWith())
})
