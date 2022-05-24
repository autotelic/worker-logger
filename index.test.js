import test from 'ava'
import sinon from 'sinon'
import { Logger, createSeqReporter } from './index.js'

test.before(async t => {
  const reporter = sinon.spy()
  const log = new Logger({ reporter })
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = { reporter, log, clock }
})

test.after(async t => {
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
      '@l': 'INFO'
    },
    {
      '@t': '2022-05-23T23:07:30.160Z',
      '@m': 'another log message',
      '@l': 'INFO'
    }
  ])
  t.true(fetchClient.calledOnceWith(
    'http://localhost:5341/api/events/raw',
    {
      body: '{"@t":"2022-05-23T23:02:30.160Z","@m":"log message","@l":"INFO"}\n' +
        '{"@t":"2022-05-23T23:07:30.160Z","@m":"another log message","@l":"INFO"}',
      method: 'POST',
      headers: { 'content-type': 'application/vnd.serilog.clef' }
    }
  ))
})
