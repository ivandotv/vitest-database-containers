import timeSpan from 'time-span'

export async function teardown() {
  const end = timeSpan()
  console.log('teardown started')

  //tear it down
  await Promise.all(
    global.containers.map((container) => container.stop({ timeout: 10000 }))
  )

  console.log(`teardown done in: ${end.seconds()} seconds`)
}
