import { authClient } from "./lib/auth-client"

function App() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) return <div>Loading...</div>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Better Auth + Prisma + Hono</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user.name}!</p>
          <p>Email: {session.user.email}</p>
          <button onClick={() => authClient.signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>You are not signed in.</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => authClient.signIn.social({ provider: 'github' })}>
              Sign in with GitHub
            </button>
            <button onClick={() => authClient.signIn.social({ provider: 'google' })}>
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
