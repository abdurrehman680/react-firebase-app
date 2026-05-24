// src/pages/ViewSingleItem.jsx
// Dynamic route: /books/:id
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useToast } from '../components/ToastProvider'
import { StarDisplay } from '../components/StarRating'

export default function ViewSingleItem() {
  const { id }    = useParams()           // ← dynamic route parameter
  const navigate  = useNavigate()
  const toast     = useToast()
  const [book,    setBook]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchBook() {
      try {
        const snap = await getDoc(doc(db, 'books', id))
        if (snap.exists()) {
          setBook({ id: snap.id, ...snap.data() })
        } else {
          toast('Book not found.', 'error')
          navigate('/books')
        }
      } catch (err) {
        toast('Could not load book.', 'error')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id])  // eslint-disable-line

  async function handleDelete() {
    if (!confirm(`Delete "${book.title}"?`)) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'books', id))
      toast('Book deleted.')
      navigate('/books')
    } catch {
      toast('Delete failed.', 'error')
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="loading-state"><div className="spinner" />Loading book…</div>
    </div>
  )

  if (!book) return null

  const addedOn = book.createdAt?.toDate?.()?.toLocaleDateString('en-PK', {
    year:'numeric', month:'long', day:'numeric'
  }) ?? 'Unknown date'

  return (
    <div className="page">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/books" className="btn btn-outline btn-sm">← Back to All Books</Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            {book.genre && <span className="card-genre" style={{marginBottom:'0.75rem',display:'block'}}>{book.genre}</span>}
            <h1 className="detail-title">{book.title}</h1>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', flexShrink:0 }}>
            <Link to={`/edit/${id}`} className="btn btn-gold btn-sm">Edit</Link>
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? '…' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="detail-meta">
          <span><strong>Author:</strong> {book.author}</span>
          {book.pages > 0 && <span><strong>Pages:</strong> {book.pages}</span>}
          <span><strong>Added:</strong> {addedOn}</span>
        </div>

        {book.rating && (
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontSize:'0.82rem', fontWeight:600, textTransform:'uppercase',
              letterSpacing:'0.06em', color:'var(--brown-mid)', marginBottom:'0.4rem' }}>
              Rating
            </p>
            <StarDisplay rating={book.rating} />
          </div>
        )}

        {book.review && (
          <div>
            <p style={{ fontSize:'0.82rem', fontWeight:600, textTransform:'uppercase',
              letterSpacing:'0.06em', color:'var(--brown-mid)', marginBottom:'0.6rem' }}>
              Review
            </p>
            <div className="detail-review">{book.review}</div>
          </div>
        )}
      </div>
    </div>
  )
}
