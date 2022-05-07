const getLogger = async (event, config) => {
  const queue = []

  const reporter = async queue => {
    queue.forEach(logEvent => console.log(`${logEvent['@l']}: ${logEvent[`@m`]}`))
  }

  const enqueue = (level, msg) => queue.push({
    '@t': new Date().toISOString(),
    '@m': msg,
    '@l': level,
  })

  return {
    queue,
    info: msg => enqueue('INFO', msg),
    report: () => event.waitUntil(reporter(queue))
  }
}

export default async function (event, router) {
  const log = await getLogger(event)
  const { request } = event
  log.info('logger created')
  const res = await router.handle(request, event)
  log.report()
  return res
}
