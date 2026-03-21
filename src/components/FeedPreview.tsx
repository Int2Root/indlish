import { MOCK_POSTS } from "@/lib/constants";

function PostCard({ post }: { post: (typeof MOCK_POSTS)[number] }) {
  return (
    <article className="glass rounded-2xl p-4 sm:p-5 hover:bg-white/[0.07] transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full ${post.avatarColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
        >
          {post.avatar}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm truncate">
              {post.author}
            </span>
            <span className="text-gray-500 text-xs">{post.handle}</span>
            <span className="text-gray-600 text-xs ml-auto flex-shrink-0">
              {post.time}
            </span>
          </div>

          {/* Content */}
          <p className="text-gray-200 text-sm sm:text-[15px] leading-relaxed mb-3">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-5 text-gray-500">
            <button className="flex items-center gap-1.5 text-xs hover:text-neon-pink transition-colors group">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="group-hover:text-neon-pink">{post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs hover:text-neon-blue transition-colors group">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments}</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs hover:text-neon-green transition-colors group">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{post.reposts}</span>
            </button>

            <button className="flex items-center gap-1.5 text-xs hover:text-saffron-400 transition-colors group ml-auto">
              <span className="text-base">💸</span>
              <span className="font-medium text-saffron-400/80 group-hover:text-saffron-400">
                {post.tips}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FeedPreview() {
  return (
    <section id="feed" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="chip mb-4 inline-block">Live Feed Preview</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Aise dikhega tumhara <span className="gradient-text">feed</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Real talk, real vibes. No cringe captions — sirf Hinglish mein apni
            baat.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Feed column */}
          <div className="lg:col-span-3 space-y-3">
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compose mock */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-xs">
                  U
                </div>
                <div className="flex-1">
                  <div className="text-gray-500 text-sm mb-3 pb-3 border-b border-white/5">
                    Kya chal raha hai? Bata do sabko... ✍️
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 text-gray-600">
                      <span className="text-base cursor-pointer hover:scale-110 transition-transform">📷</span>
                      <span className="text-base cursor-pointer hover:scale-110 transition-transform">😄</span>
                      <span className="text-base cursor-pointer hover:scale-110 transition-transform">📊</span>
                      <span className="text-base cursor-pointer hover:scale-110 transition-transform">#️⃣</span>
                    </div>
                    <button className="btn-primary !text-xs !px-4 !py-1.5 !rounded-lg">
                      Post Karo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick info */}
            <div className="glass rounded-2xl p-4 space-y-3">
              <h3 className="font-semibold text-white text-sm">Kaise kaam karta hai? 🤔</h3>
              <div className="space-y-2.5">
                {[
                  { icon: "✏️", text: "Hinglish mein post likho" },
                  { icon: "💸", text: "UPI se creators ko tip karo" },
                  { icon: "🔥", text: "Trending topics follow karo" },
                  { icon: "🤝", text: "Apna tribe build karo" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <span className="text-base">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
