import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-5 pb-[150px]">
      <SignIn />
    </div>
  )
}

export default SignInPage
