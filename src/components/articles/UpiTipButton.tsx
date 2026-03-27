'use client';

import { useState } from 'react';
import { IndianRupee, X, ExternalLink } from 'lucide-react';

interface UpiTipButtonProps {
  authorName: string;
  authorUpiId: string;
  authorId: string;
  articleId?: string;
}

const TIP_AMOUNTS = [10, 50, 100, 500];

export default function UpiTipButton({ authorName, authorUpiId, authorId, articleId }: UpiTipButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);

  if (!authorUpiId) return null;

  const upiLink = `upi://pay?pa=${encodeURIComponent(authorUpiId)}&pn=${encodeURIComponent(authorName)}&am=${selectedAmount}&cu=INR&tn=${encodeURIComponent('Tip on indlish')}`;

  // Fallback for non-UPI browsers (deep link via intent)
  const handleTip = () => {
    window.location.href = upiLink;
    // Track tip in background
    fetch('/api/tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: selectedAmount, toUserId: authorId, articleId }),
    }).catch(() => {});
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-sm font-medium transition-colors"
      >
        <IndianRupee size={15} />
        Support this writer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-light border border-neutral-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Tip {authorName.split(' ')[0]} ☕</h3>
              <button onClick={() => setOpen(false)} className="p-1 text-text-muted hover:text-text-primary">
                <X size={18} />
              </button>
            </div>

            <p className="text-text-secondary text-sm mb-5">
              Ek chai dila do! Your tip goes directly to the creator via UPI. 🙏
            </p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {TIP_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selectedAmount === amt
                      ? 'bg-brand-500/20 border-brand-500/60 text-brand-400'
                      : 'border-neutral-700 text-text-secondary hover:border-neutral-600'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleTip}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-medium transition-colors"
            >
              <IndianRupee size={16} />
              Send ₹{selectedAmount} via UPI
              <ExternalLink size={14} />
            </button>

            <p className="text-center text-text-muted text-xs mt-3">
              Opens your UPI app (GPay, PhonePe, Paytm, etc.)
            </p>
          </div>
        </div>
      )}
    </>
  );
}
