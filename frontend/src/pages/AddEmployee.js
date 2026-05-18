import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addEmployee } from '../utils/api';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    skills: [],
    performanceScore: '',
    experience: '',
  });

  const departments = [
    'Development', 'Design', 'Marketing', 'HR', 'Finance',
    'Operations', 'Sales', 'Support', 'Management', 'QA',
  ];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
    }
    setSkillInput('');
  };

  const removeSkill = (skill) =>
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) {
      toast.error('Please add at least one skill');
      return;
    }
    setLoading(true);
    try {
      await addEmployee({
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee added successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>➕ Add Employee</h1>
        <p>Register a new employee in the system</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Aman Verma"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="aman@gmail.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience *</label>
              <input
                type="number"
                name="experience"
                placeholder="3"
                value={form.experience}
                onChange={handleChange}
                min="0"
                max="50"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Performance Score (0–100) *</label>
            <input
              type="number"
              name="performanceScore"
              placeholder="85"
              value={form.performanceScore}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
            {form.performanceScore && (
              <div className="score-bar" style={{ marginTop: '0.5rem' }}>
                <div
                  className="score-fill"
                  style={{
                    width: `${form.performanceScore}%`,
                    background:
                      form.performanceScore >= 80 ? '#10b981' :
                      form.performanceScore >= 60 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Skills *</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Python..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <button type="button" className="btn btn-outline" onClick={addSkill}>
                Add
              </button>
            </div>
            <div className="skills-list" style={{ minHeight: 32 }}>
              {form.skills.map((s) => (
                <span
                  key={s}
                  className="skill-tag"
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeSkill(s)}
                  title="Click to remove"
                >
                  {s} ✕
                </span>
              ))}
              {form.skills.length === 0 && (
                <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>
                  Type a skill and press Enter or click Add
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner"></span> Saving...</> : '✅ Save Employee'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
