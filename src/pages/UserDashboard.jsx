// src/pages/UserDashboard.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { logOut, deleteAccount } from '../firebase/authService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ToastProvider'
import { StarDisplay } from '../components/StarRating'

export default function UserDashboard() {
  const { currentUser, userRole } = useAuth()
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast    = useToast()

  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const q    = query(collection(db, 'books'), where('uid', '==', currentUser.uid))
        const snap = await getDocs(q)
        setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyBooks()
  }, [currentUser])

  async function handleLogout() {
    await logOut()
    toast('Signed out.')
    navigate('/login')
  }

  async function handleDeleteAccount() {
    if (!confirm('Permanently delete your account? This cannot be undone.')) return
    try {
      await deleteAccount()
      toast('Account deleted.')
      navigate('/login')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        toast('Please sign out and sign in again before deleting your account.', 'error')
      } else {
        toast('Failed to delete account.', 'error')
      }
    }
  }

  const avgRating = books.length
    ? (books.reduce((s, b) => s + (b.rating || 0), 0) / books.length).toFixed(1)
    : '—'

  const genreCounts = books.reduce((acc, b) => {
    if (b.genre) acc[b.genre] = (acc[b.genre] || 0) + 1
    return acc
  }, {})
  const topGenre = Object.entries(genreCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? '—'

  return (
    <div className="page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="page-title" style={{ marginBottom:'0.2rem' }}>
            {userRole === 'admin' ? '⚡ Admin' : '👤 My'} Dashboard
          </h1>
          <p className="page-subtitle" style={{ marginBottom:0 }}>
            {currentUser.displayName || currentUser.email}
            <span className={`role-badge ${userRole}`}>{userRole}</span>
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {userRole === 'admin' && (
            <Link to="/admin" className="btn btn-gold btn-sm">Admin Panel</Link>
          )}
          <Link to="/chat"  className="btn btn-outline btn-sm">💬 Chat</Link>
          <Link to="/books" className="btn btn-outline btn-sm">📚 All Books</Link>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-num">{loading ? '…' : books.length}</div>
          <div className="dash-stat-label">Books Added</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">{loading ? '…' : avgRating}</div>
          <div className="dash-stat-label">Avg Rating</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">{loading ? '…' : topGenre}</div>
          <div className="dash-stat-label">Top Genre</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">
            {loading ? '…' : books.reduce((s, b) => s + (Number(b.pages) || 0), 0).toLocaleString()}
          </div>
          <div className="dash-stat-label">Pages Read</div>
        </div>
      </div>

      {/* My Books */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
        <h2 style={{ fontFamily:'Playfair Display, serif', fontSize:'1.4rem', color:'var(--brown-dark)' }}>
          My Books
        </h2>
        <Link to="/create" className="btn btn-primary btn-sm">+ Add Book</Link>
      </div>

      {loading ? (
        <div className="loading-state"><div className="spinner" />Loading…</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No books yet. Start tracking your reading!</p>
          <Link to="/create" className="btn btn-primary">+ Add First Book</Link>
        </div>
      ) : (
        <div className="cards-grid">
          {books.map(book => (
            <div key={book.id} className="card">
              {book.genre && <span className="card-genre">{book.genre}</span>}
              <h3 className="card-title">{book.title}</h3>
              <p className="card-author">by {book.author}</p>
              {book.rating && <StarDisplay rating={book.rating} />}
              <div className="card-actions">
                <Link to={`/books/${book.id}`}  className="btn btn-outline btn-sm">View</Link>
                <Link to={`/edit/${book.id}`}   className="btn btn-gold btn-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danger Zone */}
      <div className="danger-zone">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account and all associated data.</p>
        <button className="btn btn-danger btn-sm" onClick={handleDeleteAccount}>
          Delete My Account
        </button>
      </div>
    </div>
  )
}
