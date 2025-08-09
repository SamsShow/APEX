import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div className="text-sm text-zinc-400">© {new Date().getFullYear()} Apex. All rights reserved.</div>
        <nav className="flex gap-6 text-sm text-zinc-300">
          <a className="hover:text-white" href="#">Privacy</a>
          <a className="hover:text-white" href="#">Terms</a>
          <a className="hover:text-white" href="#">Security</a>
        </nav>
      </div>
    </footer>
  );
}


