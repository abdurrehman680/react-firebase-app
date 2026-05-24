// src/components/StarRating.jsx

// Display-only star component
export function StarDisplay({ rating }) {
  return (
    <div className="card-rating" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <span key={i}>{i <= rating ? '★' : '☆'}</span>
      ))}
    </div>
  )
}

// Interactive star selector for forms
export function StarSelector({ value, onChange }) {
  return (
    <div className="star-selector" role="radiogroup" aria-label="Rating">
      {[5,4,3,2,1].map(star => (
        <label key={star} title={`${star} stars`}>
          <input
            type="radio"
            name="rating"
            value={star}
            checked={Number(value) === star}
            onChange={() => onChange(star)}
          />
          ★
        </label>
      ))}
    </div>
  )
}
