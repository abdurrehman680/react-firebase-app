// src/components/Navbar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../firebase/authService'
import { useToast } from './ToastProvider'

export default function Navbar() {
  const { currentUser, userRole } = useAuth()
  const navigate = useNavigate()
  const toast    = useToast()

  async function handleLogout() {
    await logOut()
    toast('Signed out.')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        📚 <span>Book</span>Shelf
      </NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/" end>Home</NavLink></li>
        {currentUser ? (
          <>
            <li><NavLink to="/books">All Books</NavLink></li>
            <li><NavLink to="/create">+ Add Book</NavLink></li>
            <li><NavLink to="/chat">💬 Chat</NavLink></li>
            {userRole === 'admin' && (
              <li><NavLink to="/admin">⚡ Admin</NavLink></li>
            )}
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li>
              <button
                onClick={handleLogout}
                style={{ background:'none', border:'none', cursor:'pointer',
                  color:'rgba(255,255,255,0.75)', fontFamily:'inherit',
                  fontSize:'0.9rem', padding:'0.5rem 1rem', borderRadius:'6px',
                  transition:'all 0.25s' }}
                onMouseEnter={e => { e.target.style.background='rgba(255,255,255,0.08)'; e.target.style.color='var(--gold-light)' }}
                onMouseLeave={e => { e.target.style.background='none'; e.target.style.color='rgba(255,255,255,0.75)' }}
              >
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/login">Sign In</NavLink></li>
            <li><NavLink to="/signup">Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  )
}
