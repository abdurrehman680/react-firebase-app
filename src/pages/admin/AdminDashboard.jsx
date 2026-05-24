// src/pages/admin/AdminDashboard.jsx
// Only accessible to users with role === 'admin'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useToast } from '../../components/ToastProvider'

export default function AdminDashboard() {
  const [users,   setUsers]   = useState([])
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    async function fetchAll() {
      try {
        const [uSnap, bSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'books')),
        ])
        setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })))
        setBooks(bSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (err) {
        toast('Failed to load data.', 'error')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  async function toggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      await updateDoc(doc(db, 'users', user.id), { role: newRole })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
      toast(`${user.displayName || user.email} is now ${newRole}.`)
    } catch {
      toast('Failed to update role.', 'error')
    }
  }

  async function deleteBook(id, title) {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteDoc(doc(db, 'books', id))
      setBooks(prev => prev.filter(b => b.id !== id))
      toast('Book deleted.')
    } catch {
      toast('Delete failed.', 'error')
    }
  }

  const adminCount = users.filter(u => u.role === 'admin').length
  const genreMap   = books.reduce((acc, b) => { if (b.genre) acc[b.genre]=(acc[b.genre]||0)+1; return acc }, {})
  const topGenres  = Object.entries(genreMap).sort((a,b)=>b[1]-a[1]).slice(0,3)

  if (loading) return (
    <div className="page"><div className="loading-state"><div className="spinner"/>Loading…</div></div>
  )

  return (
    <div className="page">
      <div className="dash-header">
        <div>
          <h1 className="page-title" style={{ marginBottom:'0.2rem' }}>⚡ Admin Panel</h1>
          <p className="page-subtitle" style={{ marginBottom:0 }}>Full system overview & management</p>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          <Link to="/dashboard" className="btn btn-outline btn-sm">My Dashboard</Link>
          <Link to="/books"     className="btn btn-outline btn-sm">All Books</Link>
          <Link to="/chat"      className="btn btn-gold btn-sm">💬 Chat</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-num">{users.length}</div>
          <div className="dash-stat-label">Total Users</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">{adminCount}</div>
          <div className="dash-stat-label">Admins</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">{books.length}</div>
          <div className="dash-stat-label">Total Books</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-num">{topGenres[0]?.[0] ?? '—'}</div>
          <div className="dash-stat-label">Top Genre</div>
        </div>
      </div>

      {/* Genre Breakdown */}
      {topGenres.length > 0 && (
        <div className="admin-section">
          <h2 className="admin-section-title">Genre Breakdown</h2>
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            {Object.entries(genreMap).sort((a,b)=>b[1]-a[1]).map(([genre, count]) => (
              <div key={genre} className="genre-pill">
                <span>{genre}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="admin-section">
        <h2 className="admin-section-title">All Users ({users.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.displayName || '—'}</td>
                  <td style={{ fontSize:'0.85rem' }}>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </td>
                  <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>
                    {user.createdAt?.toDate?.()?.toLocaleDateString() ?? '—'}
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleRole(user)}>
                      Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All Books Table */}
      <div className="admin-section">
        <h2 className="admin-section-title">All Books ({books.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>{book.author}</td>
                  <td>{book.genre || '—'}</td>
                  <td>{'★'.repeat(book.rating || 0)}</td>
                  <td style={{ display:'flex', gap:'0.4rem' }}>
                    <Link to={`/books/${book.id}`} className="btn btn-outline btn-sm">View</Link>
                    <Link to={`/edit/${book.id}`}  className="btn btn-gold btn-sm">Edit</Link>
                    <button className="btn btn-danger btn-sm"
                      onClick={() => deleteBook(book.id, book.title)}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
