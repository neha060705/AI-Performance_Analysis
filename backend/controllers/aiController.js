const fetch = require('node-fetch');
const Employee = require('../models/Employee');

// @desc    Get AI recommendation for a single employee
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      res.status(400);
      throw new Error('employeeId is required');
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const prompt = `You are an HR AI Assistant. Analyze this employee's profile and provide structured recommendations.

Employee Profile:
- Name: ${employee.name}
- Department: ${employee.department}
- Performance Score: ${employee.performanceScore}/100
- Years of Experience: ${employee.experience}
- Skills: ${employee.skills.length > 0 ? employee.skills.join(', ') : 'Not listed'}

Please provide:
1. **Promotion Recommendation**: Should this employee be promoted? Why or why not?
2. **Training Suggestions**: What specific skills or courses should they pursue?
3. **Overall Rating**: Rate as Excellent / Good / Average / Needs Improvement
4. **Action Plan**: 2-3 concrete next steps for this employee's growth

Keep the response concise, professional, and actionable.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://emp-analytics.app',
        'X-Title': 'Employee Analytics App',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'AI API request failed');
    }

    const data = await response.json();
    const recommendation = data.choices[0]?.message?.content || 'No recommendation generated.';

    res.json({
      employee: {
        _id: employee._id,
        name: employee.name,
        department: employee.department,
        performanceScore: employee.performanceScore,
      },
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI rankings for all employees
// @route   GET /api/ai/rankings
// @access  Private
const getEmployeeRankings = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });

    if (employees.length === 0) {
      return res.json({ rankings: [], message: 'No employees found' });
    }

    const employeeList = employees
      .map(
        (e, i) =>
          `${i + 1}. ${e.name} | Dept: ${e.department} | Score: ${e.performanceScore}/100 | Exp: ${e.experience} yrs | Skills: ${e.skills.join(', ') || 'N/A'}`
      )
      .join('\n');

    const prompt = `You are an HR AI Assistant. Rank the following employees and provide brief feedback for each.

Employees (already sorted by score):
${employeeList}

For each employee provide a one-line feedback and tag them as: 🏆 Top Performer / ✅ Good / ⚠️ Needs Improvement.
Format: [Rank]. [Name] - [Tag] - [One line feedback]`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://emp-analytics.app',
        'X-Title': 'Employee Analytics App',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'AI API request failed');
    }

    const data = await response.json();
    const aiRankings = data.choices[0]?.message?.content || 'Could not generate rankings.';

    res.json({
      totalEmployees: employees.length,
      employees: employees.map((e, i) => ({
        rank: i + 1,
        _id: e._id,
        name: e.name,
        department: e.department,
        performanceScore: e.performanceScore,
        experience: e.experience,
        skills: e.skills,
      })),
      aiRankings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, getEmployeeRankings };
