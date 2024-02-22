import Link from 'next/link'

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-5 pb-[150px]">
      <Link href="/tracker">
        <div className="text-6xl font-semibold">Constellate</div>
        <div className="text-3xl">Habit tracking for humans</div>
      </Link>
    </div>
  )
}

export default LandingPage
