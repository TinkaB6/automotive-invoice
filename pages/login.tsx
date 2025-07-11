import { useState } from 'react'
import { supabase } from '../utils/supabaseClient'
import { useRouter } from 'next/router'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert('Login failed: ' + error.message)
    else router.push('/dashboard')
  }

  async function handleSignup() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) alert('Signup failed: ' + error.message)
    else alert('Check your email for confirmation!')
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Sign Up</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={handleLogin} disabled={loading}>Login</button>
      <button onClick={handleSignup} disabled={loading}>Sign Up</button>
    </div>
  )
}
