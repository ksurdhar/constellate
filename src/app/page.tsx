import Link from 'next/link'

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center gap-20 pb-[8vh] px-16 mx-[auto] max-w-[1000px] min-w-[fit-content]">
      <Link href="/tracker" className="flex flex-col gap-2">
        <div className="text-6xl font-semibold hero-animation">Constellate</div>
        <div className="text-2xl text-zinc-500">
          Habit tracking for humans, aliens, and all manner of beings.
        </div>
      </Link>
      <div className="flex gap-10 flex-wrap text-zinc-200">
        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">No sign up needed</div>
          Data is saved in the browser by default. Sign up to use multiple
          devices.
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">No-streak design</div>
          Encourages you to reach your goals but doesn’t punish you for missing
          them.
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">Weekly cadence</div>
          Built strong habits by focusing on one week at a time.
        </div>
      </div>
    </div>
  )
}

export default LandingPage
