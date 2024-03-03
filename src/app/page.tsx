import Link from 'next/link'

const LandingPage = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col justify-center gap-8 sm:pb-[8vh] px-6 sm:px-16 mx-[auto] max-w-[1280px] ">
        <div className="flex flex-col gap-2 min-w-[fit-content] sm:text-left text-center sm:mb-[-24px]">
          <Link href="/tracker">
            <div className="text-5xl sm:text-6xl font-semibold hero-animation">
              Constellate
              <span
                className="hidden sm:inline font-normal w-max min-w-[72px] max-h-[42px] border border-solid border-yellow-600/70 text-yellow-400 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-yellow-400/15 focus:bg-yellow-400/15 
        focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 focus-visible:ring-offset-opacity-50 align-middle ml-6 mb-2 hover:text-yellow-400 hover:border-yellow-600"
              >
                Start Tracking
              </span>
            </div>
            <div className="text-xl sm:text-2xl text-zinc-500">
              Simple habit tracking for humans, aliens, and all manner of
              beings.
            </div>
            <span className="hero-animation flex self-center mt-4">
              <span
                className="inline sm:hidden w-max min-w-[72px] max-h-[42px] mt-4 border border-solid border-yellow-600/70 text-yellow-400 px-3 py-2 rounded-md text-base outline-none transition-colors ease-in hover:bg-yellow-400/15 focus:bg-yellow-400/15 
        focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-opacity-50 focus-visible:ring-offset-2 focus-visible:ring-offset-yellow-400 focus-visible:ring-offset-opacity-50 align-middle hover:text-yellow-400 hover:border-yellow-600"
              >
                Start Tracking
              </span>
            </span>
          </Link>
        </div>

        <div className="flex sm:gap-10 gap-8 flex-wrap text-zinc-200">
          <div className="flex flex-col gap-2 flex-1 min-w-[280px] sm:text-base text-md">
            <div className="text-xl sm:text-2xl font-semibold">
              Weekly cadence
            </div>
            Built strong habits without overwhelming yourself by focusing on one
            week at a time.
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[280px] sm:text-base text-md">
            <div className="text-xl sm:text-2xl font-semibold">
              No sign up necessary
            </div>
            Data is saved in the browser by default. Sign up to use multiple
            devices.
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-[280px] sm:text-base text-md">
            <div className="text-xl sm:text-2xl font-semibold">
              No broken streaks
            </div>
            Constellate encourages you to reach your goals but doesn’t punish
            you for missing them.
          </div>
        </div>
        <div className="absolute bottom-5 left-[calc(50%_-_97px)] text-zinc-600 hover:text-zinc-200 cursor-pointer transition-colors">
          <a href="https://github.com/ksurdhar">Made with ♡ by ksurdhar</a>
        </div>
      </div>
    </>
  )
}

export default LandingPage
