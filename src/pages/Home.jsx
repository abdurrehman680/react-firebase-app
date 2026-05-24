// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/config'

export default function Home() {
  const [bookCount, setBookCount] = useState('...')

  useEffect(() => {
    async function fetchCount() {
      try {
        const coll = collection(db, 'books')
        const snap = await getCountFromServer(coll)
        setBookCount(snap.data().count)
      } catch {
        setBookCount(0)
      }
    }
    fetchCount()
  }, [])

  return (
    <div className="page">
      <section className="hero">
        <h1 className="hero-title">
          Your personal<br /><em>reading journal</em>
        </h1>
        <p className="hero-desc">
          Track books you've read, write reviews, rate your favourites,
          and build your own digital bookshelf — all saved to the cloud.
        </p>
        <div className="hero-actions">
          <Link to="/create" className="btn btn-primary">+ Add a Book</Link>
          <Link to="/books"  className="btn btn-outline">Browse Collection</Link>
        </div>

        <div className="hero-stat">
          <div className="stat-item">
            <div className="stat-number">{bookCount}</div>
            <div className="stat-label">Books Tracked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">More to Read</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">☁</div>
            <div className="stat-label">Cloud Synced</div>
          </div>
        </div>
      </section>
    </div>
  )
}
