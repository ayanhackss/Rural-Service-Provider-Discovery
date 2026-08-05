import { useState, useEffect } from 'react';
import { getSystemHealth, getExportData } from '../../api/admin';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import { Activity, Database, Download, RefreshCw, Server, Shield, FileSpreadsheet, CheckCircle2, Clock } from 'lucide-react';

export default function SystemSettings() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exportingType, setExportingType] = useState(null);

  const fetchHealth = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true);
      const res = await getSystemHealth();
      setHealth(res.data);
      if (showToast) toast.success('System telemetry updated');
    } catch (err) {
      toast.error('Failed to load system diagnostics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleExportCSV = async (type) => {
    setExportingType(type);
    try {
      const res = await getExportData(type);
      const items = res.data.data;
      if (!items || items.length === 0) {
        toast('No records available to export', { icon: 'ℹ️' });
        return;
      }

      // Convert JSON to CSV
      const headers = Object.keys(items[0]).filter(k => !['_id', '__v', 'passwordHash'].includes(k));
      const csvRows = [
        headers.join(','),
        ...items.map(row => 
          headers.map(field => {
            let val = row[field];
            if (typeof val === 'object' && val !== null) {
              val = JSON.stringify(val).replace(/"/g, '""');
            } else if (typeof val === 'string') {
              val = `"${val.replace(/"/g, '""')}"`;
            }
            return val ?? '';
          }).join(',')
        )
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `graamseva_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${items.length} ${type} records to CSV`);
    } catch (err) {
      toast.error(`Failed to export ${type} report`);
    } finally {
      setExportingType(null);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <div className="container section-sm">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
            <div>
              <p className="label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Diagnostics & Data Hub</p>
              <h1 style={{ fontStyle: 'italic' }}>System Health & Reports</h1>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => fetchHealth(true)}
              disabled={refreshing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {loading ? (
            <Loader />
          ) : health ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {/* Telemetry Grid */}
              <div>
                <h2 style={{ fontStyle: 'italic', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Activity size={20} style={{ color: 'var(--color-accent)' }} />
                  Live Platform Telemetry
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
                  {/* DB Connection */}
                  <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="stat-card__label">MongoDB Atlas</span>
                      <Database size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="stat-card__value" style={{ color: health.dbState === 'connected' ? 'var(--color-accent)' : 'var(--color-error)', fontSize: 'var(--text-xl)' }}>
                      {health.dbState === 'connected' ? 'Connected (Atlas)' : 'Disconnected'}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
                      DB: <code>{health.dbName}</code>
                    </p>
                  </div>

                  {/* Ping Latency */}
                  <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="stat-card__label">DB Ping Latency</span>
                      <Clock size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="stat-card__value" style={{ color: health.pingLatencyMs < 100 ? 'var(--color-accent)' : 'var(--color-ink)' }}>
                      {health.pingLatencyMs} ms
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
                      Roundtrip Atlas ping
                    </p>
                  </div>

                  {/* Node Runtime */}
                  <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="stat-card__label">Server Runtime</span>
                      <Server size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="stat-card__value" style={{ fontSize: 'var(--text-xl)' }}>
                      {health.nodeVersion}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
                      Uptime: {Math.floor(health.serverUptimeSec / 60)} mins
                    </p>
                  </div>

                  {/* Total Database Records */}
                  <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="stat-card__label">Total DB Records</span>
                      <CheckCircle2 size={18} style={{ color: 'var(--color-accent)' }} />
                    </div>
                    <div className="stat-card__value">
                      {health.counts.users + health.counts.services + health.counts.bookings + health.counts.reviews}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 'var(--space-2)' }}>
                      {health.counts.services} services · {health.counts.users} users
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Export Hub */}
              <div>
                <h2 style={{ fontStyle: 'italic', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <FileSpreadsheet size={20} style={{ color: 'var(--color-accent)' }} />
                  Data Export & Reporting Hub
                </h2>
                <p className="muted" style={{ marginBottom: 'var(--space-4)' }}>
                  Export live datasets into CSV spreadsheets for offline analysis, auditing, or governmental compliance reports.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
                  {/* Export Users */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Providers & Residents</h3>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        All registered users ({health.counts.users} records) with contact details, verification status, and ratings.
                      </p>
                    </div>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleExportCSV('users')}
                      disabled={exportingType === 'users'}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                    >
                      <Download size={16} />
                      {exportingType === 'users' ? 'Exporting...' : 'Export Users CSV'}
                    </button>
                  </div>

                  {/* Export Services */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Service Catalog</h3>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        Complete directory of active and inactive services ({health.counts.services} records) with pricing and categories.
                      </p>
                    </div>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleExportCSV('services')}
                      disabled={exportingType === 'services'}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                    >
                      <Download size={16} />
                      {exportingType === 'services' ? 'Exporting...' : 'Export Services CSV'}
                    </button>
                  </div>

                  {/* Export Bookings */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Bookings & Work Orders</h3>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        All customer appointment bookings ({health.counts.bookings} records) with status, date, time, and party details.
                      </p>
                    </div>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleExportCSV('bookings')}
                      disabled={exportingType === 'bookings'}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                    >
                      <Download size={16} />
                      {exportingType === 'bookings' ? 'Exporting...' : 'Export Bookings CSV'}
                    </button>
                  </div>

                  {/* Export Reviews */}
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Customer Reviews</h3>
                      <p className="muted" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
                        All ratings and customer feedback ({health.counts.reviews} records) for quality assurance and moderation.
                      </p>
                    </div>
                    <button
                      className="btn btn-outline"
                      onClick={() => handleExportCSV('reviews')}
                      disabled={exportingType === 'reviews'}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                    >
                      <Download size={16} />
                      {exportingType === 'reviews' ? 'Exporting...' : 'Export Reviews CSV'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Security Notes */}
              <div className="card" style={{ borderLeft: '4px solid var(--color-accent)', padding: 'var(--space-6)' }}>
                <h3 style={{ fontStyle: 'italic', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Shield size={18} style={{ color: 'var(--color-accent)' }} />
                  Security & Direct User Control
                </h3>
                <p className="muted" style={{ fontSize: 'var(--text-sm)' }}>
                  As an Administrator, you can manage user credentials directly from the <strong>Providers</strong> and <strong>Residents</strong> tabs. You can reset any account password with 1-click, promote users to administrative roles, or suspend abusive accounts with instant cascading service deactivation.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </>
  );
}
