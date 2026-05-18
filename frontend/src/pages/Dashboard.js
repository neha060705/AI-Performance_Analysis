import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getEmployees } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const totalEmployees = employees.length;
  const avgScore =
    employees.length > 0
      ? (employees.reduce((a, e) => a + e.performanceScore, 0) / employees.length).toFixed(1)
      : 0;
  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 50).length;

  // Department chart data
  const deptMap = {};
  employees.forEach((e) => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const deptData = Object.entries(deptMap).map(([name, count]) => ({ name, count }));

  // Score distribution
  const scoreRanges = [
    { name: '90-100', count: employees.filter((e) => e.performanceScore >= 90).length },
    { name: '70-89', count: employees.filter((e) => e.performanceScore >= 70 && e.performanceScore < 90).length },
    { name: '50-69', count: employees.filter((e) => e.performanceScore >= 50 && e.performanceScore < 70).length },
    { name: 'Below 50', count: employees.filter((e) => e.performanceScore < 50).length },
  ];

  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your workforce overview.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{totalEmployees}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-label">Avg Performance</div>
          <div className="stat-value">{avgScore}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-label">Top Performers</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{topPerformers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-label">Needs Improvement</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{needsImprovement}</div>
        </div>
      </div>

      {/* Charts */}
      {employees.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Employees by Department</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Score Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={scoreRanges} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" label={({ name, count }) => count > 0 ? name : ''}>
                  {scoreRanges.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/employees/add" className="btn btn-primary">➕ Add Employee</Link>
          <Link to="/employees" className="btn btn-outline">👥 View All Employees</Link>
          <Link to="/ai/recommend" className="btn btn-outline">🤖 AI Recommendations</Link>
          <Link to="/ai/rankings" className="btn btn-outline">🏆 Employee Rankings</Link>
        </div>
      </div>

      {/* Top 5 employees */}
      {employees.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>🏅 Top 5 Performers</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Department</th><th>Score</th><th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((e, i) => (
                  <tr key={e._id}>
                    <td><strong>{i + 1}</strong></td>
                    <td>{e.name}</td>
                    <td><span className="badge badge-info">{e.department}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: e.performanceScore >= 80 ? '#10b981' : e.performanceScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {e.performanceScore}
                        </span>
                        <div className="score-bar" style={{ width: 80 }}>
                          <div
                            className="score-fill"
                            style={{
                              width: `${e.performanceScore}%`,
                              background: e.performanceScore >= 80 ? '#10b981' : e.performanceScore >= 60 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>{e.experience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
