export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="loader" />
      </div>
    );
  }
  return (
    <div className="loader-wrap">
      <div className="loader" />
    </div>
  );
}
