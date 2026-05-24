// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPassword } from '../../firebase/authService'
import { useToast } from '../../components/ToastProvider'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      toast('Reset email sent! Check your inbox.')
    } catch (err) {
      const msg = err.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : 'Failed to send reset email.'
      toast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🔑</div>
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">We'll send a reset link to your email</p>

        {sent ? (
          <div className="auth-success-box">
            <p>✅ Reset link sent to <strong>{email}</strong>.</p>
            <p style={{ marginTop:'0.5rem', fontSize:'0.88rem', color:'var(--text-muted)' }}>
              Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="btn btn-outline" style={{ marginTop:'1rem', display:'inline-block' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }} disabled={loading}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-footer">
          <Link to="/login" className="auth-link">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  )
}
