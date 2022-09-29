import test from 'ava'
import sinon from 'sinon'
import { Miniflare } from 'miniflare'

test.before(async t => {
  const batchReporter = sinon.spy()
  const queueReporter = sinon.spy()
  const debugReporter = sinon.spy()
  const traceReporter = sinon.spy()
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = {
    batchReporter,
    queueReporter,
    debugReporter,
    traceReporter,
    clock
  }
})

test.after(async t => {
  const { context } = t
  const { clock } = context
  clock.restore()
})

test('log and report', async t => {
  const outFile = './util/worker/dist/logger.js'

  const { context } = t

  const {
    batchReporter,
    queueReporter,
    debugReporter,
    traceReporter
  } = context

  const mf = new Miniflare({
    scriptPath: outFile,
    buildCommand: `npm run build-test -- --outfile=${outFile} out=./lib/logger/workerRunner.js`,
    globals: {
      batchReporter,
      queueReporter,
      debugReporter,
      traceReporter
    }
  })

  const res = await mf.dispatchFetch('http://localhost:8787/', {})
  const text = await res.text()
  t.is(text, 'Wrapped Handler')

  t.true(batchReporter.calledOnceWith([
    { time: 1653346950160, level: 30, msg: 'log info' },
    { time: 1653346950160, level: 40, msg: 'log warn' },
    { time: 1653346950160, level: 50, msg: 'log error' },
    { time: 1653346950160, level: 60, msg: 'log fatal' }
  ]))

  // TODO remaining tests
})
