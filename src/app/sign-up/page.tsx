import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-5 pb-[150px]">
      <SignUp />
    </div>
  )
}

export default SignUpPage
