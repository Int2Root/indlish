import { TRENDING_TOPICS } from "@/lib/constants";

export default function Trending() {
  return (
    <section id="trending" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="chip mb-4 inline-block">Trending Now 📈</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Abhi kya <span className="gradient-text">trend</span> kar raha hai
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Real-time trending topics from the indlish community. Join the
            conversation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {TRENDING_TOPICS.map((topic, i) => (
            <div
              key={topic.tag}
              className="glass rounded-xl p-4 hover:bg-white/[0.07] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] text-gray-600 font-medium">
                  #{i + 1} Trending
                </span>
                {topic.trend === "up" && (
                  <svg
                    className="w-4 h-4 text-neon-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
              </div>
              <div className="text-white font-bold text-sm group-hover:text-saffron-400 transition-colors">
                {topic.tag}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {topic.posts} posts
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
