import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">AuthPulse</span>
          <span aria-hidden="true">·</span>
          <span>WhatBytes Frontend Engineering Assignment</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>React Custom Hooks</span>
          <span aria-hidden="true">·</span>
          <span>Zero External Backend</span>
          <span aria-hidden="true">·</span>
          <span>Next.js App Router Architecture</span>
        </div>
      </div>
    </footer>
  );
};
