import Link from 'next/link'

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center gap-8 pb-[8vh] px-6 sm:px-16 mx-[auto] max-w-[1280px] ">
      <div className="flex flex-col gap-2 min-w-[fit-content] sm:text-left text-center">
        <div className="text-6xl font-semibold hero-animation">
          Constellate
          <Link
            href="/tracker"
            className="hidden sm:inline font-normal w-max min-w-[72px] max-h-[42px] border border-solid border-yellow-600/70 text-yellow-400 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-yellow-400/15 focus:bg-yellow-400/15 
        focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 focus-visible:ring-offset-opacity-50 align-middle ml-6 mb-2 hover:text-yellow-400 hover:border-yellow-600"
            type="submit"
          >
            Start Tracking
          </Link>
        </div>
        <div className="text-2xl text-zinc-500">
          Simple habit tracking for humans, aliens, and all manner of beings.
        </div>
        <span className="hero-animation flex self-center">
          <Link
            href="/tracker"
            className="inline sm:hidden w-max min-w-[72px] max-h-[42px] mt-4 border border-solid border-yellow-600/70 text-yellow-400 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-yellow-400/15 focus:bg-yellow-400/15 
        focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 focus-visible:ring-offset-opacity-50 align-middle hover:text-yellow-400 hover:border-yellow-600"
            type="submit"
          >
            Start Tracking
          </Link>
        </span>
      </div>

      <div className="flex gap-10 flex-wrap text-zinc-200">
        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">Weekly cadence</div>
          Built strong habits without overwhelming yourself by focusing on one
          week at a time.
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">No sign up necessary</div>
          Data is saved in the browser by default. Sign up to use multiple
          devices.
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-[280px] ">
          <div className="text-2xl font-semibold">No-streak design</div>
          Constellate encourages you to reach your goals but doesn’t punish you
          for missing them.
        </div>
      </div>
    </div>
  )
}

export default LandingPage
