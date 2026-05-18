import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEmployees, searchEmployees, deleteEmployee } from '../utils/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', department: '', minScore: '', maxScore: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.name) params.name = search.name;
      if (search.department) params.department = search.department;
      if (search.minScore) params.minScore = search.minScore;
      if (search.maxScore) params.maxScore = search.maxScore;
      const { data } = await searchEmployees(params);
      setEmployees(data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch({ name: '', department: '', minScore: '', maxScore: '' });
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted');
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const getScoreColor = (score) =>
    score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  const getScoreBadge = (score) =>
    score >= 80 ? 'badge-success' : score >= 60 ? 'badge-warning' : 'badge-danger';

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>👥 Employees</h1>
          <p>{employees.length} employees found</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">➕ Add Employee</Link>
      </div>

      {/* Search & Filter */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>🔍 Search & Filter</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <input
            type="text"
            placeholder="Filter by department..."
            value={search.department}
            onChange={(e) => setSearch({ ...search, department: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <input
            type="number"
            placeholder="Min score"
            value={search.minScore}
            onChange={(e) => setSearch({ ...search, minScore: e.target.value })}
            style={{ maxWidth: 110 }}
          />
          <input
            type="number"
            placeholder="Max score"
            value={search.maxScore}
            onChange={(e) => setSearch({ ...search, maxScore: e.target.value })}
            style={{ maxWidth: 110 }}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          <button className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👤</div>
          <p style={{ color: '#6b7280' }}>No employees found. Add one to get started!</p>
          <Link to="/employees/add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Add First Employee
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Exp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e, i) => (
                  <tr key={e._id}>
                    <td style={{ color: '#9ca3af' }}>{i + 1}</td>
                    <td><strong>{e.name}</strong></td>
                    <td style={{ color: '#6b7280', fontSize: '0.82rem' }}>{e.email}</td>
                    <td><span className="badge badge-info">{e.department}</span></td>
                    <td>
                      <div className="skills-list">
                        {e.skills.slice(0, 3).map((s) => (
                          <span key={s} className="skill-tag">{s}</span>
                        ))}
                        {e.skills.length > 3 && (
                          <span className="skill-tag">+{e.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getScoreBadge(e.performanceScore)}`}>
                        {e.performanceScore}
                      </span>
                    </td>
                    <td>{e.experience}y</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          to={`/employees/edit/${e._id}`}
                          className="btn btn-outline btn-sm"
                        >
                          ✏️
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(e._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
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

export default EmployeeList;
