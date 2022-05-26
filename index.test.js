import test from 'ava'
import sinon from 'sinon'
import { Logger, createSeqReporter } from './index.js'

test.before(async t => {
  const batchReporter = sinon.spy()
  const queueReporter = sinon.spy()
  const log = new Logger({ transports: [
    { reporter: batchReporter },
    { reporter: queueReporter, batch: false }
  ] })
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = { batchReporter, queueReporter, log, clock }
})

test.after(async t => {
  const { context } = t
  const { clock } = context
  clock.restore()
})

test('log and report', async t => {
  const { context } = t
  const { batchReporter, queueReporter, log } = context

  log.info('log message')
  log.debug('debug log message')
  log.report()

  t.true(batchReporter.calledOnceWith([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'log message',
      '@l': 'info'
    }
  ]))

  t.true(queueReporter.calledOnceWith({
    '@t': '2022-05-23T23:02:30.160Z',
    '@m': 'log message',
    '@l': 'info'
  }))
})

test('seq reporter', async t => {
  const fetchClient = sinon.spy()
  const reporter = createSeqReporter(
    'http://localhost:5341',
    fetchClient
  )

  reporter([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'log message',
      '@l': 'info'
    },
    {
      '@t': '2022-05-23T23:07:30.160Z',
      '@m': 'another log message',
      '@l': 'info'
    }
  ])
  t.true(fetchClient.calledOnceWith(
    'http://localhost:5341/api/events/raw',
    {
      body: '{"@t":"2022-05-23T23:02:30.160Z","@m":"log message","@l":"info"}\n' +
        '{"@t":"2022-05-23T23:07:30.160Z","@m":"another log message","@l":"info"}',
      method: 'POST',
      headers: { 'content-type': 'application/vnd.serilog.clef' }
    }
  ))
})
