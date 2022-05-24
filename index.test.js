import test from 'ava'
import sinon from 'sinon'
import { Logger } from './index.js'

test.beforeEach(async t => {
  const reporter = sinon.spy()
  const log = new Logger({ reporter })
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = { reporter, log, clock }
})

test.afterEach(async t => {
  const { context } = t
  const { clock } = context
  clock.restore()
})

test('log and report', async t => {
  const { context } = t
  const { reporter, log } = context

  log.info('log message')
  log.report()

  t.true(reporter.calledOnceWith([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'log message',
      '@l': 'INFO'
    }
  ]))
})
