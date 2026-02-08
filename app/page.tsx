import Link from 'next/link';
import { Rocket, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans selection:bg-indigo-500/30">

      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-8 mb-16">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-br from-indigo-400 via-cyan-400 to-white bg-clip-text text-transparent animate-pulse">
          PARABOLA WORLD
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Master the curves of the universe. Choose your path.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">

        {/* Story Mode Card - Tech Flat Style */}
        <Link
          href="/story-mode"
          className="group relative overflow-hidden bg-indigo-950/20 border border-indigo-500/50 hover:border-indigo-400 transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Tech Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-10 relative z-10 flex flex-col h-full font-mono">
            <div className="w-16 h-16 bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-400/30 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Rocket className="w-8 h-8 text-indigo-300 group-hover:text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors uppercase tracking-wider">
              Story Mode
            </h2>
            <div className="text-xs text-indigo-400 mb-6 uppercase tracking-[0.2em] border-l-2 border-indigo-500 pl-2">
              Interstellar Chronicles
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
              JOIN CAPTAIN LIN AND AI DEER. NAVIGATE THE GREAT LINEARIZATION.
              EXECUTE QUADRATIC MANEUVERS TO RESTORE CURVATURE.
            </p>
            <div className="flex items-center text-indigo-300 font-bold group-hover:translate-x-2 transition-transform text-sm tracking-widest uppercase">
              [ INITIALIZE MISSION ] <span className="ml-2">→</span>
            </div>
          </div>
        </Link>

        {/* Classic Mode Card - Tech Flat Style */}
        <Link
          href="/parabola-world"
          className="group relative overflow-hidden bg-slate-900/20 border border-slate-700/50 hover:border-slate-500 transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Tech Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-500 opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-slate-500 opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-slate-500 opacity-30 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-slate-500 opacity-30 group-hover:opacity-100 transition-opacity" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="p-10 relative z-10 flex flex-col h-full font-mono">
            <div className="w-16 h-16 bg-slate-700/10 flex items-center justify-center mb-6 border border-slate-600/30 group-hover:bg-slate-700 group-hover:text-white transition-colors">
              <BookOpen className="w-8 h-8 text-slate-300 group-hover:text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-200 mb-2 group-hover:text-white transition-colors uppercase tracking-wider">
              Classic Mode
            </h2>
            <div className="text-xs text-slate-500 mb-6 uppercase tracking-[0.2em] border-l-2 border-slate-600 pl-2">
              Standard Training
            </div>
            <p className="text-slate-400 leading-relaxed mb-8 flex-1 text-sm">
              PURE MATHEMATICAL TRAINING. FOCUS ON PARABOLA MECHANICS.
              NO NARRATIVE INTERFERENCE. OPTIMIZED FOR PRACTICE.
            </p>
            <div className="flex items-center text-slate-400 font-bold group-hover:translate-x-2 transition-transform text-sm tracking-widest uppercase">
              [ ENTER SANDBOX ] <span className="ml-2">→</span>
            </div>
          </div>
        </Link>

      </div>

      <footer className="mt-20 text-slate-600 text-sm font-mono">
        v6.0.0 // SYSTEM_READY
      </footer>
    </div>
  );
}
