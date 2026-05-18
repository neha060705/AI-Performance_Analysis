import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEmployees, getAIRecommendation } from '../utils/api';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getEmployees()
      .then(({ data }) => setEmployees(data))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setFetching(false));
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) {
      toast.error('Please select an employee');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await getAIRecommendation(selectedId);
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI recommendation failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) =>
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="page">
      <div className="page-header">
        <h1>🤖 AI Recommendations</h1>
        <p>Get AI-powered insights for employee performance, promotion, and training</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Selector */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Select Employee</h3>

          {fetching ? (
            <div className="loading" style={{ minHeight: 80 }}>Loading...</div>
          ) : (
            <>
              <div className="form-group">
                <select
                  value={selectedId}
                  onChange={(e) => { setSelectedId(e.target.value); setResult(null); }}
                >
                  <option value="">-- Choose an employee --</option>
                  {employees.map((e) => (
                    <option key={e._id} value={e._id}>
                      {e.name} ({e.department}) — {e.performanceScore}/100
                    </option>
                  ))}
                </select>
              </div>

              {selectedId && (() => {
                const emp = employees.find((e) => e._id === selectedId);
                return emp ? (
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{emp.name}</strong>
                      <span style={{ color: getScoreColor(emp.performanceScore), fontWeight: 600 }}>
                        {emp.performanceScore}/100
                      </span>
                    </div>
                    <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {emp.department} · {emp.experience} yrs exp
                    </div>
                    <div className="skills-list">
                      {emp.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}
                    </div>
                    <div className="score-bar" style={{ marginTop: '0.75rem' }}>
                      <div className="score-fill" style={{ width: `${emp.performanceScore}%`, background: getScoreColor(emp.performanceScore) }} />
                    </div>
                  </div>
                ) : null;
              })()}

              <button
                className="btn btn-primary btn-block"
                onClick={handleGenerate}
                disabled={loading || !selectedId}
              >
                {loading ? <><span className="spinner"></span> Generating AI Report...</> : '✨ Generate Recommendation'}
              </button>
            </>
          )}
        </div>

        {/* Result */}
        <div>
          {loading && (
            <div className="card">
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite', display: 'inline-block' }}>🤖</div>
                <p style={{ color: '#6b7280' }}>AI is analyzing the employee profile...</p>
                <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginTop: '0.5rem' }}>This may take a few seconds</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '1.5rem' }}>🤖</div>
                <div>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>AI Analysis for {result.employee.name}</h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                    {result.employee.department} · Score: {result.employee.performanceScore}/100
                  </p>
                </div>
              </div>
              <div className="ai-box">{result.recommendation}</div>
              <button
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  navigator.clipboard.writeText(result.recommendation);
                  toast.success('Copied to clipboard!');
                }}
              >
                📋 Copy Report
              </button>
            </div>
          )}

          {!result && !loading && (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>AI Recommendations</h3>
              <p style={{ color: '#9ca3af' }}>
                Select an employee from the left panel and click "Generate Recommendation" to get AI-powered insights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
