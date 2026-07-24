import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--color-rule)', 
      background: 'var(--color-paper-2)',
      padding: 'var(--space-8) var(--space-4) calc(var(--space-8) + env(safe-area-inset-bottom, 0)) var(--space-4)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-8)' }}>
        
        <div>
          <Link to="/" className="navbar__brand" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
            Graam<span>Seva</span>
          </Link>
          <p style={{ color: 'var(--color-ink-dim)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
            Empowering rural communities by connecting skilled local professionals with households in need. Reliable, verified, and community-driven.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)', color: 'var(--color-ink)', fontWeight: 500 }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/services" style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Find a Service</Link>
            <Link to="/register" style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Join as Provider</Link>
            <Link to="/login" style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)', textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-4)', color: 'var(--color-ink)', fontWeight: 500 }}>Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
              <MapPin size={16} /> District Headquarters
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
              <Phone size={16} /> +91 1800 123 4567
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
              <Mail size={16} /> support@graamseva.in
            </div>
          </div>
        </div>

      </div>

      <div className="container" style={{ 
        marginTop: 'var(--space-8)', 
        paddingTop: 'var(--space-6)', 
        borderTop: '1px solid var(--color-rule)', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-2)',
        color: 'var(--color-muted)', 
        fontSize: 'var(--text-xs)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <Heart size={12} style={{ color: 'var(--color-error)' }} /> for Rural India
        </div>
        <div>&copy; {new Date().getFullYear()} GraamSeva. All rights reserved.</div>
      </div>
    </footer>
  );
}
