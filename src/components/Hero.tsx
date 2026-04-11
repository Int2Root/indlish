export default function Hero() {
  return (
    <section className="relative isolate min-h-screen flex items-center justify-center pt-16">
      {/* Background effects — clipped to section bounds without creating compositor boundary */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-saffron-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[150px]" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-sm font-medium mb-8 animate-pulse-slow">
          <span className="w-2 h-2 rounded-full bg-saffron-400 animate-ping" />
          Early Access — Jaldi aao, pehle aao!
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight mb-6 text-balance">
          India ka apna{" "}
          <span className="gradient-text">social platform</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-4 text-balance">
          Where <span className="text-white font-semibold">Hinglish</span> is
          the vibe. Post karo, tip karo, vibe karo. ✨
        </p>

        <p className="text-sm text-gray-500 max-w-lg mx-auto mb-10">
          Text-first microblogging platform jahan tum apni baat apni language
          mein bol sakte ho. No filters, no fake algorithms — sirf real desi
          content.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="#waitlist" className="btn-primary text-base px-8 py-4 glow-saffron">
            Waitlist Join Karo 🚀
          </a>
          <a href="#feed" className="btn-ghost text-base px-8 py-4">
            Pehle Dekh Lo 👀
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">10k+</div>
            <div className="text-xs text-gray-500 mt-1">Waitlist mein</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">50k+</div>
            <div className="text-xs text-gray-500 mt-1">Posts daily</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">₹2L+</div>
            <div className="text-xs text-gray-500 mt-1">Tips given</div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
