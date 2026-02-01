import { authClient } from "./lib/auth-client"
import { useState } from "react"

function App() {
  const { data: session, isPending } = authClient.useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSignup = async () => {
    try {
      // @ts-ignore
      await authClient.signUp.email({
        email,
        password,
        name: email.split('@')[0],
      })
      setMessage("Verification email sent! Please check your inbox.")
    } catch (e: any) {
      setMessage(e.message || "Signup failed")
    }
  }

  const handleSignin = async () => {
    try {
      await authClient.signIn.email({ email, password })
      setMessage("Signed in!")
    } catch (e: any) {
      setMessage(e.message || "Signin failed")
    }
  }

  const handleMagicLink = async () => {
    try {
      await authClient.signIn.magicLink({ email })
      setMessage("Magic link sent! Check your email.")
    } catch (e: any) {
      setMessage(e.message || "Magic link failed")
    }
  }

  const handleResetPassword = async () => {
    try {
      // @ts-ignore
      await authClient.forgetPassword({ email, redirectTo: "/reset-password" })
      setMessage("Reset password email sent!")
    } catch (e: any) {
      setMessage(e.message || "Reset failed")
    }
  }

  if (isPending) return <div className="loading">Loading session...</div>

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', fontFamily: 'system-ui' }}>
      <h1>Better Auth Demo</h1>

      {message && <div style={{ padding: '10px', background: '#e0f7fa', borderRadius: '5px', marginBottom: '1rem' }}>{message}</div>}

      {session ? (
        <div className="profile">
          <h2>Welcome, {session.user.name}</h2>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(session, null, 2)}
          </pre>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
            <button onClick={() => authClient.signOut()} style={{ background: '#ff5252', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              Sign Out
            </button>
            {session.user.isAdmin && (
              <span style={{ padding: '10px', background: '#ffd700', borderRadius: '5px' }}>ADMIN PRIVILEGES ACTIVE</span>
            )}
          </div>
        </div>
      ) : (
        <div className="auth-forms">
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '0.5rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '0.5rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
            <button onClick={handleSignin} style={{ padding: '10px' }}>Sign In</button>
            <button onClick={handleSignup} style={{ padding: '10px' }}>Sign Up</button>
            <button onClick={handleMagicLink} style={{ padding: '10px' }}>Send Magic Link</button>
            <button onClick={handleResetPassword} style={{ padding: '10px' }}>Reset Password</button>
          </div>

          <hr />

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => authClient.signIn.social({ provider: 'github' })} style={{ padding: '10px', background: '#333', color: 'white' }}>
              Sign in with GitHub
            </button>
            <button onClick={() => authClient.signIn.social({ provider: 'google' })} style={{ padding: '10px', background: '#4285f4', color: 'white' }}>
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
