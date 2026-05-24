// src/pages/EditItem.jsx
// Dynamic route: /edit/:id
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useToast } from '../components/ToastProvider'
import { StarSelector } from '../components/StarRating'

const GENRES = ['Fiction','Non-Fiction','Science Fiction','Fantasy','Mystery',
  'Thriller','Romance','Biography','History','Self-Help','Other']

export default function EditItem() {
  const { id }   = useParams()           // ← dynamic route parameter
  const navigate = useNavigate()
  const toast    = useToast()

  const [form,    setForm]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)

  // Pre-fill form with existing Firestore data
  useEffect(() => {
    async function fetchBook() {
      try {
        const snap = await getDoc(doc(db, 'books', id))
        if (snap.exists()) {
          const data = snap.data()
          setForm({
            title:  data.title  ?? '',
            author: data.author ?? '',
            genre:  data.genre  ?? '',
            pages:  data.pages  ?? '',
            rating: data.rating ?? 3,
            review: data.review ?? '',
          })
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

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.author.trim()) {
      toast('Title and Author are required.', 'error')
      return
    }
    setSaving(true)
    try {
      await updateDoc(doc(db, 'books', id), {
        ...form,
        pages:     Number(form.pages) || 0,
        rating:    Number(form.rating),
        updatedAt: serverTimestamp(),
      })
      toast('Book updated successfully! ✏️')
      navigate(`/books/${id}`)
    } catch (err) {
      toast('Update failed.', 'error')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="page">
      <div className="loading-state"><div className="spinner" />Loading book…</div>
    </div>
  )

  if (!form) return null

  return (
    <div className="page">
      <div style={{ marginBottom: '1rem' }}>
        <Link to={`/books/${id}`} className="btn btn-outline btn-sm">← Back to Book</Link>
      </div>
      <h1 className="page-title">Edit Book</h1>
      <p className="page-subtitle">Update the details below and save your changes.</p>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" name="title" value={form.title}
              onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <input className="form-input" name="author" value={form.author}
              onChange={handleChange} required />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select className="form-select" name="genre" value={form.genre} onChange={handleChange}>
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Pages</label>
              <input className="form-input" name="pages" type="number" min="1"
                value={form.pages} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Your Rating</label>
            <StarSelector value={form.rating}
              onChange={val => setForm(p => ({ ...p, rating: val }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Review / Notes</label>
            <textarea className="form-textarea" name="review"
              value={form.review} onChange={handleChange} />
          </div>

          <div style={{ display:'flex', gap:'0.75rem', marginTop:'0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '✓ Update Book'}
            </button>
            <button type="button" className="btn btn-outline"
              onClick={() => navigate(`/books/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
