import { Link } from 'react-router-dom';
import { Wrench, Zap, BookOpen, Stethoscope, Hammer, Settings, Scissors, BrickWall, Paintbrush, Wheat, Sparkles, PenTool } from 'lucide-react';
import StarRating from './StarRating';

const CATEGORY_ICONS = {
  Plumber: Wrench, Electrician: Zap, Tutor: BookOpen,
  Doctor: Stethoscope, Mechanic: Settings, Tailor: Scissors, Mason: BrickWall,
  Painter: Paintbrush, Agricultural: Wheat, Cleaner: Sparkles, Carpenter: Hammer, Other: PenTool,
};

export default function ServiceCard({ service }) {
  const { _id, title, category, description, priceRange, averageRating, totalReviews, providerId } = service;
  const provider = typeof providerId === 'object' ? providerId : null;

  return (
    <Link to={`/services/${_id}`} style={{ display: 'block' }}>
      <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Category icon + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-accent)' }}>
            {(() => {
              const IconComp = CATEGORY_ICONS[category] || CATEGORY_ICONS.Other;
              return <IconComp size={24} strokeWidth={1.5} />;
            })()}
          </span>
          <span className="label">{category}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 'var(--text-lg)', fontStyle: 'italic', lineHeight: 1.2 }}>
          {title}
        </h3>

        {/* Description */}
        <p className="muted" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5, flex: 1 }}>
          {description.length > 100 ? description.slice(0, 100) + '…' : description}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <StarRating rating={averageRating || 0} size="sm" />
          <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
            {averageRating ? averageRating.toFixed(1) : '—'}
            {totalReviews > 0 && ` (${totalReviews})`}
          </span>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-rule)' }}>
          <span style={{ fontFamily: 'var(--font-outlier)', fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontVariantNumeric: 'tabular-nums' }}>
            ₹{priceRange?.min}–{priceRange?.max}
          </span>
          {provider && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
              {provider.name}
              {provider.location?.village && ` · ${provider.location.village}`}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
