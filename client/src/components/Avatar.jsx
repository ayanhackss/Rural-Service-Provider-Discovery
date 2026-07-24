import BoringAvatar from 'boring-avatars';

export default function Avatar({ name, size = 40, variant = 'beam' }) {
  const safeName = name || 'Anonymous';
  return (
    <div 
      className="avatar-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px var(--color-rule)',
        backgroundColor: 'var(--color-paper-2)'
      }}
    >
      <BoringAvatar
        size={size}
        name={safeName}
        variant={variant}
        colors={['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7']}
      />
    </div>
  );
}
