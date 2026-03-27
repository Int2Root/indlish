'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('pwa_dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa_dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-surface-light border border-neutral-700 rounded-2xl p-4 shadow-2xl">
      <button onClick={dismiss} className="absolute top-3 right-3 text-text-muted hover:text-text-primary">
        <X size={16} />
      </button>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
          <span className="text-lg font-bold text-brand-400">in</span>
        </div>
        <div>
          <p className="font-semibold text-sm">Install indlish</p>
          <p className="text-text-muted text-xs mt-0.5">Add to home screen for quick access, even offline!</p>
          <button onClick={install} className="mt-2 flex items-center gap-1.5 btn-primary text-xs !px-3 !py-1.5">
            <Download size={12} /> Add to Home Screen
          </button>
        </div>
      </div>
    </div>
  );
}
