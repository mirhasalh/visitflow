'use client'

import SignUpForm from '@/components/SignUpForm'
import LogInForm from '@/components/LogInForm'
import useShowLoginFormStore from '@/stores/useShowLoginFormStore'
import VisitFlowLogo from '@/components/VisitFlowLogo'

export default function Home() {
  const showLoginForm = useShowLoginFormStore((state) => state.showLoginForm)

  return (
    <div>
      <main>
        <section className="hero bg-base-200 min-h-screen">
          <div className="hero-content bg-base-100 h-full min-w-sm">
            <div className="grid w-full">
              <div className="flex flex-col items-center justify-center text-center">
                <VisitFlowLogo className="block" />
                <h1 className="text-3xl font-bold">Visit Flow</h1>
                <p className="py-6 text-sm">Manage your visits.</p>
              </div>
              {showLoginForm ? <LogInForm></LogInForm> : <SignUpForm></SignUpForm>}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
