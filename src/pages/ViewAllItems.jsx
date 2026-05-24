// src/pages/ViewAllItems.jsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useToast } from '../components/ToastProvider'
import { StarDisplay } from '../components/StarRating'

export default function ViewAllItems() {
  const [books,   setBooks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const toast = useToast()

  async function fetchBooks() {
    try {
      const q    = query(collection(db, 'books'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      toast('Could not load books. Check Firestore config.', 'error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooks() }, [])  // eslint-disable-line

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'books', id))
      setBooks(prev => prev.filter(b => b.id !== id))
      toast('Book deleted.')
    } catch {
      toast('Delete failed.', 'error')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="loading-state">
        <div className="spinner" />
        Loading your bookshelf…
      </div>
    </div>
  )

  return (
    <div className="page">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'0.25rem' }}>
        <h1 className="page-title" style={{ marginBottom:0 }}>All Books</h1>
        <Link to="/create" className="btn btn-primary btn-sm">+ Add Book</Link>
      </div>
      <p className="page-subtitle">{books.length} book{books.length !== 1 ? 's' : ''} in your collection</p>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>No books yet. Start by adding one!</p>
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
              {book.review && <p className="card-review">{book.review}</p>}
              {book.pages > 0 && (
                <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
                  {book.pages} pages
                </p>
              )}
              <div className="card-actions">
                <Link to={`/books/${book.id}`} className="btn btn-outline btn-sm">View</Link>
                <Link to={`/edit/${book.id}`}  className="btn btn-gold btn-sm">Edit</Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(book.id, book.title)}
                  disabled={deleting === book.id}
                >
                  {deleting === book.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
