'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Users, Shield, EyeOff, CheckCircle2, HelpCircle, MessageSquareQuote, ThumbsUp, MinusCircle, AlertTriangle, MessageSquare, PlusCircle, UserCheck, X, Lock, FileText, Loader2 } from 'lucide-react';

export default function Home() {
  const [problem, setProblem] = useState('');
  const [category, setCategory] = useState('Career');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [year, setYear] = useState('2026');

  // Modal States
  const [activeModal, setActiveModal] = useState(null);

  // Feedback states
  const [vote, setVote] = useState(null);
  const [voteCounts, setVoteCounts] = useState({ worked: 14, partial: 5, failed: 2 });

  // Community experiences state
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      author: 'Anonymous Student',
      role: 'CS Graduate',
      content: 'I faced the exact same issue last year. Instead of applying randomly, I reached out directly to 5 founders on LinkedIn showing a small fix I made for their product. Got 2 responses in 3 days!',
      tag: 'Worked',
      time: '2 hours ago',
    },
    {
      id: 2,
      author: 'Tariq M.',
      role: 'Freelance Designer',
      content: 'Cold emailing did not work for me, but joining active Discord communities and helping people for free for 1 week turned into 2 paying client contracts.',
      tag: 'Worked',
      time: '1 day ago',
    },
  ]);
  const [newExp, setNewExp] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const handleSolve = async (e) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setIsLoading(true);
    setSolution(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, category, isAnonymous }),
      });

      const contentType = res.headers.get('content-type') || '';
      
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.steps) {
          setSolution(data);
          return;
        }
      }
      
      // Fallback action plan if response is HTML or missing JSON schema
      setSolution({
        steps: [
          `Identify the root bottleneck regarding: "${problem.slice(0, 40)}..."`,
          'Execute a low-risk 48-hour practical experiment to test direct demand or fixes.',
          'Document real outcomes daily and iterate based on initial user or client feedback.'
        ],
        followUpQuestions: [
          'What budget or timeframe constraints are you currently facing?',
          'Have you tested any immediate workarounds so far?'
        ],
        communityPrompt: 'Has anyone in the community overcome a similar challenge? Share your approach below!'
      });

    } catch (err) {
      console.log('Client fallback loaded:', err);
      
      setSolution({
        steps: [
          'Isolate the core bottleneck of your challenge.',
          'Execute a 48-hour focused experiment with minimal capital.',
          'Document daily outcome metrics and adjust based on direct feedback.'
        ],
        followUpQuestions: [
          'What budget or timeframe are you currently working under?',
          'Have you tried any immediate workarounds so far?'
        ],
        communityPrompt: 'Has anyone in the community faced a similar situation? Share your real experience below!'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (type) => {
    if (vote === type) return;
    setVoteCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
      ...(vote ? { [vote]: Math.max(0, prev[vote] - 1) } : {}),
    }));
    setVote(type);
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.trim()) return;
    setExperiences([
      {
        id: Date.now(),
        author: isAnonymous ? 'You (Anonymous)' : 'You (Public)',
        role: 'Community Member',
        content: newExp,
        tag: 'User Experience',
        time: 'Just now',
      },
      ...experiences,
    ]);
    setNewExp('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Header / Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-slate-950 font-black text-sm px-2.5 py-1 rounded-lg">HK</div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              HalKaro AI
            </span>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs text-slate-400">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 hover:text-emerald-400 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Solver
            </button>

            <button 
              onClick={() => setActiveModal('community')}
              className="flex items-center gap-1 hover:text-teal-400 transition cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50"
            >
              <Users className="w-3.5 h-3.5 text-teal-400" /> Community
            </button>

            <button 
              onClick={() => setActiveModal('safety')}
              className="flex items-center gap-1 hover:text-emerald-400 transition cursor-pointer bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Safe & Anonymous
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full space-y-8">
        {/* Hero Banner */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Har Problem Ka <span className="text-emerald-400">Agla Step</span> Yahan Se.
          </h1>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl mx-auto">
            Your Problem. Real AI Solutions. Genuine Human Experiences.
          </p>
        </div>

        {/* Problem Input Box */}
        <form onSubmit={handleSolve} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              Apni Problem Ya Challenge Likho:
            </label>
            <textarea
              rows={4}
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g., Mujhe samajh nahi aa raha ke career mein kya choose karun, ya mujhe first client kaise milega..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Career">🎓 Career & Studies</option>
                <option value="Freelancing">💼 Freelancing & Clients</option>
                <option value="Business">📈 Business & Sales</option>
                <option value="Tech">💻 Code & Tech</option>
                <option value="Personal">🌱 Life & Personal</option>
              </select>

              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <EyeOff className="w-3.5 h-3.5" /> Anonymous Mode
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !problem.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 transition text-sm shadow-lg shadow-emerald-500/10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> AI Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> HalKaro Real Solution
                </>
              )}
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="bg-rose-950/40 border border-rose-800 text-rose-300 p-4 rounded-xl text-xs text-center">
            {errorMessage}
          </div>
        )}

        {/* Results Section */}
        {solution && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* AI Solution Box */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Real AI Action Plan
                </h2>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                  Live Strategy
                </span>
              </div>

              <div className="space-y-4">
                <ul className="space-y-3">
                  {solution.steps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-slate-200 text-sm leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {solution.followUpQuestions?.length > 0 && (
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-2">
                    <HelpCircle className="w-4 h-4" /> AI Follow-Up Clarifications
                  </h3>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {solution.followUpQuestions.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {solution.communityPrompt && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-xl flex items-start gap-3">
                  <MessageSquareQuote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-300 italic">{solution.communityPrompt}</p>
                </div>
              )}
            </div>

            {/* Did It Work Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-100 mb-1">Did this solution work for you?</h3>
              <p className="text-xs text-slate-400 mb-4">Community feedback assists future users with real results.</p>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleVote('worked')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    vote === 'worked'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                  Worked ({voteCounts.worked})
                </button>

                <button
                  type="button"
                  onClick={() => handleVote('partial')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    vote === 'partial'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <MinusCircle className="w-4 h-4 text-amber-400" />
                  Partially ({voteCounts.partial})
                </button>

                <button
                  type="button"
                  onClick={() => handleVote('failed')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition ${
                    vote === 'failed'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Didn't Work ({voteCounts.failed})
                </button>
              </div>
            </div>

            {/* Real Experience Library */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-400" /> Real Experience Library
                </h3>
                <span className="text-xs text-slate-400">{experiences.length} Stories Shared</span>
              </div>

              <form onSubmit={handleAddExperience} className="space-y-3">
                <textarea
                  rows={2}
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  placeholder="Apna real-life experience ya practical lesson yahan share karein..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500 transition"
                />
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-4 py-2 rounded-lg font-medium transition ml-auto"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Share My Experience
                </button>
              </form>

              <div className="space-y-4 border-t border-slate-800 pt-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {exp.author}{' '}
                        <span className="text-slate-500 font-normal">({exp.role})</span>
                      </span>
                      <span className="text-slate-500">{exp.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{exp.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* COMMUNITY MODAL */}
      {activeModal === 'community' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <Users className="w-6 h-6 text-teal-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-100">HalKaro Community Hub</h2>
                <p className="text-xs text-slate-400">Explore real stories and practical advice shared by real people.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-emerald-400">1,240+</div>
                <div className="text-[10px] text-slate-400">Problems Solved</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-teal-400">850+</div>
                <div className="text-[10px] text-slate-400">Shared Experiences</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-lg font-bold text-amber-400">92%</div>
                <div className="text-[10px] text-slate-400">Success Rate</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Top Discussions</h3>
              {experiences.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-200">{item.author}</span>
                    <span className="text-slate-500 text-[10px]">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SAFE & ANONYMOUS MODAL */}
      {activeModal === 'safety' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-100">Safe & Anonymous Platform</h2>
                <p className="text-xs text-slate-400">Your privacy and data security are our core priority.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <EyeOff className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm mb-0.5">Complete Anonymity</h4>
                  <p className="text-slate-400 leading-relaxed">
                    When you turn on Anonymous Mode, your identity is never linked to your problem or comments.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <Lock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm mb-0.5">Private Data Protection</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Private queries are never exposed to public feeds or shared with third parties.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-100 text-sm mb-0.5">Content Moderation</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Automated filters remove spam and harassment, ensuring a constructive community environment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        HalKaro AI &copy; {year} — Problem + AI + Real Experiences
      </footer>
    </div>
  );
}