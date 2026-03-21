import { FEATURES } from "@/lib/constants";

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28 px-4 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-saffron-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="chip mb-4 inline-block">Why indlish? 🤷</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Aisa platform jo <span className="gradient-text">samjhe tujhe</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Baaki platforms pe tum fit hote ho unke rules mein. Yahan rules
            tumhare hain.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.emoji}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
