import { Link } from "react-router-dom";

// ✅ YouTube URL'sinden Video ID çıkarma fonksiyonu
export const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// YouTube thumbnail URL'si oluşturma
const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// Kapak resmi URL'sini belirleme
export const getCoverImage = (lofi) => {
  if (lofi.coverImg) return lofi.coverImg;
  if (lofi.videoUrl) {
    const youtubeThumbnail = getYouTubeThumbnail(lofi.videoUrl);
    if (youtubeThumbnail) return youtubeThumbnail;
  }
  return "/default-cover.jpg";
};

export default function LofiList({ search, category, lofies = [] }) {
  // ✅ Filtrelenmiş liste
  const filteredLofies = lofies.filter(lofi => {
    // Arama filtresi
    if (search && !lofi.title?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Kategori filtresi (All değilse) — case-insensitive
    if (category && category !== "All" && lofi.category?.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    return true;
  });

  if (filteredLofies.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4 opacity-50">
        <span className="text-4xl text-white">📭</span>
        <p className="text-white font-medium tracking-wide">Flow not found...</p>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
      {filteredLofies.map((lofi) => {
        const coverImage = getCoverImage(lofi);

        return (
          <Link
            key={lofi._id}
            to={`/${lofi._id}`}
            className="cursor-pointer group flex flex-col gap-3 transition-all duration-300"
          >
            {/* Square Image container with rounded corners */}
            <div className="w-full aspect-square rounded-[12px] overflow-hidden bg-[#111] relative shadow-lg shadow-black/40 border border-white/5">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={lofi.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  onError={(e) => {
                    if (e.target.src.includes('maxresdefault.jpg')) {
                      e.target.src = e.target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    } else {
                      e.target.src = "/default-cover.jpg";
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 to-slate-900 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-white/20 text-4xl">🎵</span>
                </div>
              )}

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 mix-blend-multiply transition-opacity group-hover:opacity-50" />
            </div>

            {/* Text Content */}
            <div className="flex flex-col px-0.5">
              <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors">
                {lofi.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-white/50 text-[12px] font-semibold truncate">
                  {lofi.author || "FocusFlow Mix"}
                </p>
                <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-white/60 font-medium">
                  {lofi.category}
                </span>
              </div>
            </div>
          </Link>
        )
      })}
    </main>
  );
}