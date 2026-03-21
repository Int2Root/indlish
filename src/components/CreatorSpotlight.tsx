import { CREATORS } from "@/lib/constants";

function CreatorCard({ creator }: { creator: (typeof CREATORS)[number] }) {
  return (
    <div className="gradient-border p-5 sm:p-6 rounded-2xl bg-surface-800/50 hover:bg-surface-700/50 transition-colors group">
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-full ${creator.avatarColor} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}
        >
          {creator.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{creator.name}</h3>
          <p className="text-gray-500 text-sm">{creator.handle}</p>
          <p className="text-gray-400 text-sm mt-1.5">{creator.bio}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/5">
        <div className="text-center">
          <div className="text-white font-semibold text-sm">{creator.followers}</div>
          <div className="text-gray-500 text-xs mt-0.5">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-saffron-400 font-semibold text-sm">{creator.tips}</div>
          <div className="text-gray-500 text-xs mt-0.5">Tips earned</div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold text-sm">{creator.posts}</div>
          <div className="text-gray-500 text-xs mt-0.5">Posts</div>
        </div>
      </div>

      <button className="btn-ghost w-full mt-4 !text-sm !py-2">
        Follow Karo ✨
      </button>
    </div>
  );
}

export default function CreatorSpotlight() {
  return (
    <section id="creators" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="chip mb-4 inline-block">Creator Spotlight 🌟</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Top <span className="gradient-text">creators</span> jo rule kar rahe
            hain
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Yeh log apni Hinglish content se laakhon kamaa rahe hain. Next tu ho
            sakta hai.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CREATORS.map((creator) => (
            <CreatorCard key={creator.handle} creator={creator} />
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            <span className="text-saffron-400 font-semibold">500+</span>{" "}
            creators already earning via UPI tips 💰
          </p>
        </div>
      </div>
    </section>
  );
}
