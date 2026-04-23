'use strict';
const { Router } = require('express');
const router = Router();

const HIVEAI_URL = 'https://hive-ai-1.onrender.com/v1/chat/completions';
const HIVEAI_KEY = 'hive_internal_125e04e071e8829be631ea0216dd4a0c9b707975fcecaf8c62c6a2ab43327d46';
const MODEL = 'meta-llama/llama-3.1-8b-instruct';

async function callHiveAI(systemPrompt, userPrompt) {
  try {
    const res = await fetch(HIVEAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HIVEAI_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (e) {
    return null;
  }
}

router.post('/v1/dimensions/ai/brief', async (req, res) => {
  const { agent_did, task_description, parallelism_desired } = req.body;
  if (!agent_did || !task_description) {
    return res.status(400).json({ error: 'agent_did and task_description required' });
  }

  // Fetch current dimensions stats from self
  let stats = {};
  try {
    const port = process.env.PORT || 3016;
    const statsRes = await fetch(`http://localhost:${port}/v1/dimensions/stats`);
    stats = await statsRes.json();
  } catch (e) {
    // graceful fallback — continue without stats
  }

  const systemPrompt = `You are HiveDimensions — the multi-axis coordination engine. Recommend the optimal dimensional configuration for this task: X (parallel), Y (pipeline), Z (convergence). 2-3 sentences.`;

  const userPrompt = `Agent: ${agent_did}
Task: ${task_description}
Parallelism desired: ${parallelism_desired || 'unspecified'}
Network stats: ${JSON.stringify(stats)}

Recommend the optimal axis configuration.`;

  const brief = await callHiveAI(systemPrompt, userPrompt);

  const fallbackBrief = `For this task, the X-axis (parallel execution) is optimal to distribute workload across agents simultaneously. A Y-axis pipeline will handle sequential validation stages efficiently. Z-axis convergence should aggregate results with medium compression to balance throughput and accuracy.`;

  const resultBrief = brief || fallbackBrief;

  // Determine recommended axis
  let recommendedAxis = 'X';
  const lower = resultBrief.toLowerCase();
  if (lower.includes('pipeline') || lower.includes('y-axis') || lower.includes('y axis')) {
    recommendedAxis = 'Y';
  } else if (lower.includes('converge') || lower.includes('z-axis') || lower.includes('z axis')) {
    recommendedAxis = 'Z';
  } else if (lower.includes('parallel') || lower.includes('x-axis') || lower.includes('x axis')) {
    recommendedAxis = 'X';
  } else if (parallelism_desired && parseInt(parallelism_desired) > 5) {
    recommendedAxis = 'X';
  }

  const configs = {
    X: { axis: 'X', mode: 'parallel', agents: parallelism_desired || 3, strategy: 'fan_out' },
    Y: { axis: 'Y', mode: 'pipeline', stages: 3, strategy: 'sequential_chain' },
    Z: { axis: 'Z', mode: 'convergence', domains: 2, strategy: 'merge_reduce' }
  };

  res.json({
    success: true,
    brief: resultBrief,
    recommended_axis: recommendedAxis,
    recommended_config: configs[recommendedAxis],
    price_usdc: 0.03
  });
});

module.exports = router;
