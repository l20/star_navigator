'use client';

import { ReactNode } from 'react';

export default function ShipHUD({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden font-mono">
      {/* Outer Cockpit Bezel */}
      <div className="absolute inset-0 pointer-events-none z-[45] border-[20px] border-slate-900 rounded-[30px] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
        {/* Metal Texture Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />

        {/* Status Lights Top Left */}
        <div className="absolute top-4 left-6 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
          <div className="w-2 h-2 rounded-full bg-green-900" />
          <div className="w-2 h-2 rounded-full bg-green-900" />
        </div>

        {/* System Time Top Right */}
        <div className="absolute top-4 right-6 text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">
          SYS.V.6.0.2 // ONLINE
        </div>
      </div>

      {/* Screen Glare / Reflection */}
      <div className="absolute inset-0 pointer-events-none z-[46] bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 rounded-[20px]" />

      {/* CRT Scanline Effect (Global) */}
      <div className="absolute inset-0 pointer-events-none z-[47] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay" />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[48] bg-radial-gradient-to-c from-transparent via-transparent to-black opacity-60" />

      {/* Main Content (The Screen) */}
      <div className="absolute inset-2 md:inset-4 bg-black rounded-[10px] overflow-hidden z-0">
        {children}
      </div>
    </div>
  );
}
