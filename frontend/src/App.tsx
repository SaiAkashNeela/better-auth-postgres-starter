import { authClient } from "./lib/auth-client"
import { useState, useEffect } from "react"

const GithubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17.45 7.06l-2.73 2.73C13.84 8.59 12.01 8.5 10.3 9.4c-1.71.9-2.31 2.82-1.35 4.41.96 1.59 3.01 2.05 4.54 1.04l2.73-2.73"></path></svg>
)

function App() {
  const { data: session, isPending } = authClient.useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [view, setView] = useState<"signin" | "signup" | "magic" | "reset">("signin")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // @ts-ignore
      await authClient.signUp.email({ email, password, name, callbackURL: window.location.origin })
      setMessage({ text: "Account created! Check your email to verify.", type: "success" })
    } catch (e: any) {
      setMessage({ text: e.message || "Signup failed", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authClient.signIn.email({ email, password, callbackURL: window.location.origin })
      setMessage({ text: "Signed in successfully!", type: "success" })
    } catch (e: any) {
      setMessage({ text: e.message || "Invalid credentials", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ text: "Please enter your email first", type: "error" })
      return
    }
    setLoading(true)
    try {
      await authClient.signIn.magicLink({ email, callbackURL: window.location.origin })
      setMessage({ text: "Magic link sent to your inbox!", type: "success" })
    } catch (e: any) {
      setMessage({ text: e.message || "Failed to send magic link", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setMessage({ text: "Enter your email to reset password", type: "error" })
      return
    }
    setLoading(true)
    try {
      // @ts-ignore
      await authClient.forgetPassword({ email, redirectTo: "/reset-password" })
      setMessage({ text: "Password reset link sent!", type: "success" })
    } catch (e: any) {
      setMessage({ text: e.message || "Reset failed", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  if (isPending) return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center", padding: "4rem" }}>
        <div className="auth-title">Checking session...</div>
      </div>
    </div>
  )

  if (session) {
    return (
      <>
        <div className="bg-gradient" />
        <nav className="dashboard-nav">
          <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>Starter.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>{session.user.email}</span>
            <button
              onClick={() => authClient.signOut()}
              className="btn btn-social"
              style={{ padding: "0.5rem 1rem", marginTop: 0 }}
            >
              Sign Out
            </button>
          </div>
        </nav>

        <main className="dashboard-container">
          <header style={{ marginBottom: "3rem" }}>
            <h1 className="auth-title" style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              Welcome back, {session.user.name.split(' ')[0]}
            </h1>
            <p className="auth-subtitle">Here's a look at your session and account details.</p>
          </header>

          <div className="grid">
            <div className="card">
              <h3 style={{ marginBottom: "1rem", color: "var(--primary)" }}>Active Session</h3>
              <pre style={{ fontSize: "0.75rem", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "12px", overflow: "auto" }}>
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Profile Details</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <p>{session.user.name}</p>
                </div>
                <div>
                  <label className="form-label">Email Status</label>
                  <p>{session.user.emailVerified ? "✅ Verified" : "⚠️ Unverified"}</p>
                </div>
                {session.user.isAdmin && (
                  <div style={{ padding: "0.75rem", background: "rgba(99, 102, 241, 0.1)", border: "1px solid var(--primary)", borderRadius: "12px", color: "var(--primary)", fontWeight: 600, textAlign: "center" }}>
                    Administrator Access Active
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>API Boilerplate</h3>
              <p className="auth-subtitle" style={{ lineHeight: 1.6 }}>
                You're running the <strong>better-auth-postgres-starter</strong>.
                This implementation includes:
              </p>
              <ul style={{ listStyle: "none", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>🚀 Hono v4 + Bun Implementation</li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>🐘 Prisma + Postgres Integration</li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>📧 Maildev Local Email Support</li>
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>🛡️ Protected Routes & RBAC</li>
              </ul>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <div className="auth-container">
      <div className="bg-gradient" />

      {message && (
        <div style={{
          position: "fixed",
          top: "2rem",
          padding: "1rem 2rem",
          borderRadius: "12px",
          background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${message.type === "success" ? "#10b981" : "#f43f5e"}`,
          color: message.type === "success" ? "#10b981" : "#f43f5e",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-out"
        }}>
          {message.text}
        </div>
      )}

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {view === "signin" && "Welcome back"}
            {view === "signup" && "Create account"}
            {view === "magic" && "Instant sign-in"}
            {view === "reset" && "Reset access"}
          </h1>
          <p className="auth-subtitle">
            {view === "signin" && "Enter your credentials to access your account"}
            {view === "signup" && "Join our platform and start building today"}
            {view === "magic" && "Get a secure sign-in link delivered to your inbox"}
            {view === "reset" && "We'll help you get back into your account"}
          </p>
        </div>

        {view === "signin" && (
          <form onSubmit={handleSignin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Continue"}
            </button>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setView("reset")}
                style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "0.8125rem", cursor: "pointer" }}
              >
                Forgot password?
              </button>
            </div>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        {(view === "magic" || view === "reset") && (
          <div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              onClick={view === "magic" ? handleMagicLink : handleResetPassword}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Processing..." : view === "magic" ? "Send Magic Link" : "Send Reset Link"}
            </button>
          </div>
        )}

        <div className="divider">or continue with</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <button onClick={() => authClient.signIn.social({ provider: 'github' })} className="btn btn-social">
            <GithubIcon /> GitHub
          </button>
          <button onClick={() => authClient.signIn.social({ provider: 'google' })} className="btn btn-social">
            <GoogleIcon /> Google
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
          {view === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup")}
                style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
              >
                Sign up
              </button>
              <br />
              <button
                onClick={() => setView("magic")}
                style={{ marginTop: "0.5rem", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", textDecoration: "underline" }}
              >
                Use magic link instead
              </button>
            </>
          ) : (
            <button
              onClick={() => setView("signin")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer" }}
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>

      <div style={{ marginTop: "2rem", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
        Protected by Better Auth & Postgres
      </div>
    </div>
  )
}

export default App
