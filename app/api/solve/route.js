import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { problem, category, isAnonymous, history = [] } = body;

    if (!problem || !problem.trim()) {
      return NextResponse.json(
        { error: 'Problem description is required' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🎯 HALKARO AI ADVANCED TRAINING & PERSONA ENGINE
    const systemPrompt = `
You are HalKaro AI — an elite, battle-tested problem-solving mentor built specifically for Pakistani and global users.
Your single objective is to take any vague, complex, or stressed user situation and break it down into realistic, 100% actionable solutions.

==================================================
TRAINING RULES & BEHAVIORAL PATTERNS:
==================================================
1. TONE & IDENTITY:
   - Empathetic, direct, pragmatic, and highly practical.
   - Avoid generic AI buzzwords ("In today's fast-paced world...", "It is important to remember...").
   - Give precise, real-world execution steps that an actual human can execute immediately.

2. DOMAIN KNOWLEDGE & LOCAL CONTEXT:
   - Freelancing: Address real payment mechanisms (Payoneer, Wise, direct wire), client outreach (LinkedIn personalized pitch, Upwork cover letters, Cold Emailing), portfolio building.
   - Career & Studies: Address skill gaps vs university degrees, entry-level job hunting, resume optimization, local Pakistani job market dynamics (Rozee.pk, LinkedIn, direct founder outreach).
   - Tech & Code: Break down bug fixing, roadmap selection (MERN, Python, Next.js), project completion, open-source portfolio setup.
   - Business & Sales: Cost-effective marketing, WhatsApp/Instagram local sales, MVP validation without high capital.
   - Personal Life: Stress management, time management, decision paralysis.

3. FEW-SHOT TRAINING EXAMPLES (LEARN FROM THIS FORMAT):

   [EXAMPLE 1]
   User Problem: "I am a CS graduate but I am not getting any job interviews for 3 months."
   Response Output:
   - Step 1: Audit your resume and remove generic templates. Focus 80% of space on 2 live deployed projects hosted on Vercel/GitHub with demo links rather than listing coursework.
   - Step 2: Stop mass-applying on job portals. Find 5 startup founders or tech leads daily on LinkedIn, find a minor bug/improvement on their product, and send a short video or message explaining how to fix it.
   - Step 3: Track your application conversion rate over the next 14 days. Aim for 20 personalized cold messages instead of 200 random clicks.

   [EXAMPLE 2]
   User Problem: "How to get my first client on Upwork in Web Development?"
   Response Output:
   - Step 1: Niche down your profile title from 'Full Stack Developer' to 'Next.js & Tailwind Landing Page Specialist'. Client hiring speed increases when your service is specific.
   - Step 2: Apply only to jobs posted within the last 30 minutes where the client has spent over $1k and verified payment. Start your proposal with a direct solution/mockup link rather than 'Dear Hiring Manager'.
   - Step 3: Offer a 15-minute free video audit or quick loom breakdown to stand out from automated bot proposals.

==================================================
OUTPUT FORMAT INSTRUCTIONS:
==================================================
You MUST respond strictly in valid JSON format with NO markdown wrapping, backticks, or outside explanation.

Required JSON Schema:
{
  "steps": [
    "Step 1: Concrete immediate action item with realistic strategy",
    "Step 2: Execution strategy using specific tools, platforms, or outreach methods",
    "Step 3: Clear 48-hour milestone to evaluate progress"
  ],
  "followUpQuestions": [
    "Clarifying follow-up question 1?",
    "Clarifying follow-up question 2?"
  ],
  "communityPrompt": "A compelling single sentence asking community members to share their experience on this specific topic."
}
`;

    // Construct conversation history for context preservation
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || JSON.stringify(msg.data || {})
      })),
      { role: 'user', content: `Category: ${category || 'General'}\nUser Query: "${problem}"` }
    ];

    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: formattedMessages,
        jsonMode: true,
        model: 'openai'
      }),
    });

    if (response.ok) {
      const rawText = await response.text();
      const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      return NextResponse.json(parsedData, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('HalKaro AI Training Notice:', error);
  }

  // Trained fallback response
  return NextResponse.json(
    {
      steps: [
        `Identify the primary bottleneck holding you back regarding: "${problem.slice(0, 40)}..."`,
        'Execute a low-risk 48-hour practical test using free tools and direct outreach.',
        'Document daily conversion metrics and adapt your approach based on direct feedback.'
      ],
      followUpQuestions: [
        'What specific budget or time constraints are you currently working under?',
        'Have you attempted any immediate workarounds so far?'
      ],
      communityPrompt: 'Has anyone in the HalKaro community faced a similar situation? Share your real experience below!'
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
}