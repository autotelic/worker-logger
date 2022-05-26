import test from 'ava'
import sinon from 'sinon'
import { Logger, createSeqReporter } from './index.js'

test.before(async t => {
  const batchReporter = sinon.spy()
  const queueReporter = sinon.spy()
  const debugReporter = sinon.spy()
  const log = new Logger({
    transports: [
      { reporter: batchReporter },
      { reporter: queueReporter, batch: false },
      { reporter: debugReporter, level: 'debug' }
    ]
  })
  const clock = sinon.useFakeTimers({
    now: 1653346950160
  })
  t.context = {
    batchReporter,
    queueReporter,
    debugReporter,
    log,
    clock
  }
})

test.after(async t => {
  const { context } = t
  const { clock } = context
  clock.restore()
})

test('level methods', async t => {
  const traceReporter = sinon.spy()
  const log = new Logger({
    transports: [
      { reporter: traceReporter, level: 'trace' }
    ]
  })
  log.trace('trace log')
  log.debug('debug log')
  log.info('info log')
  log.warn('warn log')
  log.error('error log')
  log.fatal('fatal log')
  log.report()
  t.true(traceReporter.calledOnceWith([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'trace log',
      '@l': 'trace'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'debug log',
      '@l': 'debug'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'info log',
      '@l': 'info'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'warn log',
      '@l': 'warn'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'error log',
      '@l': 'error'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'fatal log',
      '@l': 'fatal'
    }
  ]))
})

test('log and report', async t => {
  const { context } = t
  const {
    batchReporter,
    queueReporter,
    debugReporter,
    log
  } = context

  log.info('log message')
  log.debug('debug log message')
  log.error('error message')
  log.report()

  t.true(batchReporter.calledOnceWith([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'log message',
      '@l': 'info'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'error message',
      '@l': 'error'
    }
  ]))

  t.true(debugReporter.calledOnceWith([
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'log message',
      '@l': 'info'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'debug log message',
      '@l': 'debug'
    },
    {
      '@t': '2022-05-23T23:02:30.160Z',
      '@m': 'error message',
      '@l': 'error'
    }
  ]))

  t.true(queueReporter.calledTwice)
  t.deepEqual(queueReporter.firstCall.firstArg, {
    '@t': '2022-05-23T23:02:30.160Z',
    '@m': 'log message',
    '@l': 'info'
  })
  t.deepEqual(queueReporter.secondCall.firstArg, {
    '@t': '2022-05-23T23:02:30.160Z',
    '@m': 'error message',
    '@l': 'error'
  })
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
