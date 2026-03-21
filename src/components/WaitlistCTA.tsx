"use client";

import { useState } from "react";

export default function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // In production, POST to your API
    }
  };

  return (
    <section id="waitlist" className="py-20 sm:py-28 px-4 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-saffron-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="gradient-border rounded-2xl p-8 sm:p-12 bg-surface-800/80 text-center">
          {/* India badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-6">
            🇮🇳 Made in India, for India
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Ready ho? <span className="gradient-text">Chalo shuru karte hain</span>
          </h2>

          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Pehle 10,000 users ko exclusive early access milega. Plus, lifetime
            &quot;OG&quot; badge — flex karne ke liye 😎
          </p>

          {submitted ? (
            <div className="glass rounded-xl p-6">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-white mb-1">
                Zabardast! Tum list mein ho
              </h3>
              <p className="text-gray-400 text-sm">
                Jaldi email aayega with early access. Tab tak apne dost ko bhi
                bata do!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="apna@email.com"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/25 text-sm"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Join Karo 🚀
              </button>
            </form>
          )}

          <p className="text-gray-600 text-xs mt-4">
            Spam nahi karenge. Pinky promise. 🤞
          </p>
        </div>
      </div>
    </section>
  );
}
