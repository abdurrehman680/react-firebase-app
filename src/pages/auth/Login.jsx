// src/pages/auth/Login.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '../../firebase/authService'
import { useToast } from '../../components/ToastProvider'

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const toast     = useToast()
  const from      = location.state?.from?.pathname ?? '/dashboard'

  function handleChange(e) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmail(form.email, form.password)
      toast('Welcome back! 👋')
      navigate(from, { replace: true })
    } catch (err) {
      toast(friendlyError(err.code), 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try {
      await signInWithGoogle()
      toast('Signed in with Google! 🎉')
      navigate(from, { replace: true })
    } catch (err) {
      toast(friendlyError(err.code), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">📚</div>
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">Welcome back to BookShelf</p>

        <button className="btn-google" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.8 13.5-4.7l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 5C9.6 39.5 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/></svg>
          Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" name="email"
              value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password"
              value={form.password} onChange={handleChange} required autoComplete="current-password" />
          </div>

          <div style={{ textAlign:'right', marginBottom:'1rem' }}>
            <Link to="/forgot-password" className="auth-link" style={{ fontSize:'0.82rem' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width:'100%' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':    'No account found with this email.',
    'auth/wrong-password':    'Incorrect password.',
    'auth/invalid-credential':'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-email':     'Please enter a valid email.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
  }
  return map[code] ?? 'Authentication failed. Please try again.'
}
