import useShowLoginFormStore from '@/stores/useShowLoginFormStore'

export default function SignUpForm() {
  const setShowLoginForm = useShowLoginFormStore((state) => state.setShowLoginForm)
  return (
    <form className="w-full min-w-0 flex-1" method="post" action="/api/sign-up" aria-labelledby="signup-title">
      <fieldset className="fieldset w-full">
        <legend id="signup-title" className="fieldset-legend hidden">
          Create a new account
        </legend>
        <label htmlFor="signup-name" className="label">
          Name
        </label>
        <input id="signup-name" name="name" type="text" className="input w-full" placeholder="Your Name" autoComplete="name" required />
        <label htmlFor="signup-email" className="label">
          Email
        </label>
        <input id="signup-email" name="email" type="email" className="input w-full" placeholder="you@example.com" autoComplete="email" inputMode="email" required />
        <label htmlFor="signup-password" className="label">
          Password
        </label>
        <input id="signup-password" name="password" type="password" className="input w-full" placeholder="Password" autoComplete="new-password" minLength={8} required />
        <button type="submit" className="btn btn-neutral mt-4 w-full">
          Sign up
        </button>
        <div className="divider" role="separator" aria-label="or">
          OR
        </div>
        <button type="button" className="btn w-full" onClick={() => setShowLoginForm(true)}>
          Already have an account? Log in
        </button>
      </fieldset>
    </form>
  )
}
