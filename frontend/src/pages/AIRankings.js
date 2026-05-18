import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { getAIRankings } from '../utils/api';

const AIRankings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setData(null);
    try {
      const { data: res } = await getAIRankings();
      setData(res);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to get rankings');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) =>
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🏆 Employee Rankings</h1>
        <p>AI-powered employee ranking and feedback across your entire workforce</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
        <h3 style={{ marginBottom: '0.5rem' }}>Generate AI Rankings</h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          The AI will analyze all employees and generate comprehensive rankings with personalized feedback
        </p>
        <button
          className="btn btn-primary"
          onClick={handleFetch}
          disabled={loading}
          style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
        >
          {loading ? <><span className="spinner"></span> Generating Rankings...</> : '✨ Generate AI Rankings'}
        </button>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#6b7280' }}>🤖 AI is analyzing and ranking all employees...</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary */}
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-label">Total Ranked</div>
              <div className="stat-value">{data.totalEmployees}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-label">Top Performer</div>
              <div className="stat-value" style={{ fontSize: '1.25rem' }}>
                {data.employees[0]?.name || 'N/A'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-label">Avg Score</div>
              <div className="stat-value">
                {data.employees.length > 0
                  ? (data.employees.reduce((a, e) => a + e.performanceScore, 0) / data.employees.length).toFixed(1)
                  : 0}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            {/* Employee table */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>📋 Ranked Employee List</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Score</th>
                      <th>Exp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.employees.map((e) => (
                      <tr key={e._id}>
                        <td style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                          {getRankBadge(e.rank)}
                        </td>
                        <td>
                          <strong>{e.name}</strong>
                          <div className="skills-list" style={{ marginTop: 4 }}>
                            {e.skills.slice(0, 2).map((s) => (
                              <span key={s} className="skill-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
                            ))}
                          </div>
                        </td>
                        <td><span className="badge badge-info">{e.department}</span></td>
                        <td>
                          <span style={{ fontWeight: 600, color: getScoreColor(e.performanceScore) }}>
                            {e.performanceScore}
                          </span>
                          <div className="score-bar" style={{ marginTop: 3, width: 60 }}>
                            <div className="score-fill" style={{ width: `${e.performanceScore}%`, background: getScoreColor(e.performanceScore) }} />
                          </div>
                        </td>
                        <td>{e.experience}y</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI feedback */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>🤖</span>
                <h3 style={{ fontSize: '1rem', margin: 0 }}>AI Feedback</h3>
              </div>
              <div className="ai-box" style={{ fontSize: '0.85rem' }}>
                {data.aiRankings}
              </div>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={() => { navigator.clipboard.writeText(data.aiRankings); toast.success('Copied!'); }}
              >
                📋 Copy Rankings
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIRankings;
