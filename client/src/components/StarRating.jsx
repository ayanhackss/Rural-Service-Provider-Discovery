export default function StarRating({ rating, max = 5, size = 'base', interactive = false, onChange }) {
  const sizeMap = { sm: '14px', base: '18px', lg: '22px' };
  const fontSize = sizeMap[size] || sizeMap.base;

  if (interactive) {
    return (
      <div className="stars" role="group" aria-label={`Rating: ${rating} of ${max}`} style={{ fontSize }}>
        {Array.from({ length: max }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange && onChange(i + 1)}
            aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: i < rating ? 'var(--color-accent)' : 'var(--color-rule)',
              fontSize,
              transition: 'color 0.12s',
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="stars"
      aria-label={`Rating: ${rating} of ${max} stars`}
      style={{ fontSize }}
    >
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? '' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}
