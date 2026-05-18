import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEmployeeById, updateEmployee } from '../utils/api';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', department: '', skills: [], performanceScore: '', experience: '',
  });

  const departments = [
    'Development', 'Design', 'Marketing', 'HR', 'Finance',
    'Operations', 'Sales', 'Support', 'Management', 'QA',
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getEmployeeById(id);
        setForm({
          name: data.name,
          email: data.email,
          department: data.department,
          skills: data.skills,
          performanceScore: data.performanceScore,
          experience: data.experience,
        });
      } catch (err) {
        toast.error('Failed to load employee');
        navigate('/employees');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [id, navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEmployee(id, {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee updated successfully!');
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="loading">Loading employee data...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>✏️ Edit Employee</h1>
        <p>Update employee details</p>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select name="department" value={form.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Years of Experience *</label>
              <input type="number" name="experience" value={form.experience} onChange={handleChange} min="0" required />
            </div>
          </div>

          <div className="form-group">
            <label>Performance Score (0–100) *</label>
            <input type="number" name="performanceScore" value={form.performanceScore} onChange={handleChange} min="0" max="100" required />
            {form.performanceScore !== '' && (
              <div className="score-bar" style={{ marginTop: '0.5rem' }}>
                <div className="score-fill" style={{
                  width: `${form.performanceScore}%`,
                  background: form.performanceScore >= 80 ? '#10b981' : form.performanceScore >= 60 ? '#f59e0b' : '#ef4444',
                }} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Skills</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              />
              <button type="button" className="btn btn-outline" onClick={addSkill}>Add</button>
            </div>
            <div className="skills-list">
              {form.skills.map((s) => (
                <span key={s} className="skill-tag" style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)} title="Click to remove">
                  {s} ✕
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner"></span> Updating...</> : '💾 Update Employee'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/employees')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
