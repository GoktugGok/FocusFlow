import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io("https://focusflow-7znc.onrender.com");

// ✅ YouTube URL'sinden Video ID çıkarma fonksiyonu
const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// YouTube thumbnail URL'si oluşturma
const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
};

// Kapak resmi URL'sini belirleme
const getCoverImage = (lofi) => {
  if (lofi.coverImg) return lofi.coverImg;

  if (lofi.videoUrl) {
    const youtubeThumbnail = getYouTubeThumbnail(lofi.videoUrl);
    if (youtubeThumbnail) return youtubeThumbnail;
  }

  return "/default-cover.jpg";
};

export default function LofiList({ search, category }) {  // ✅ 1. category prop'u zaten var
  const [lofies, setLofies] = useState([]);

  useEffect(() => {
    fetch(`https://focusflow-7znc.onrender.com/lofis`)
      .then((res) => res.json())
      .then((data) => setLofies(data))
      .catch((err) => console.log(err));

    // WebSocket event listener
    socket.on("lofiCreated", (newLofi) => {
      setLofies(prev => [...prev, newLofi]);
    });

    socket.on("lofiUpdated", (updatedLofi) => {
      setLofies(prev => prev.map(l => l._id === updatedLofi._id ? updatedLofi : l));
    });

    socket.on("lofiDeleted", (deletedId) => {
      setLofies(prev => prev.filter(l => l._id !== deletedId));
    });

    return () => socket.off();
  }, []);

  // ✅ 2. YENİ: Filtrelenmiş liste
  const filteredLofies = lofies.filter(lofi => {
    // Arama filtresi
    if (search && !lofi.title?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Kategori filtresi (All değilse)
    if (category && category !== "All" && lofi.category !== category) {
      return false;
    }

    return true;
  });

  return (
    <main className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-28 lg:pb-4">
      {filteredLofies.map((lofi) => {
        const coverImage = getCoverImage(lofi);

        return (
          <Link
            key={lofi._id}
            to={lofi._id}
            className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl group"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Resim */}
            <div className="w-full h-32 sm:h-40 relative overflow-hidden">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={lofi.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = "/default-cover.jpg"; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
                  <span className="text-white text-2xl">🎵</span>
                </div>
              )}
              {/* Karartma overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* YouTube badge */}
              {lofi.videoUrl && (
                <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </div>
              )}
            </div>

            {/* İçerik */}
            <div className="px-3 py-2.5 flex-1 flex flex-col justify-between">
              <h4 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug mb-1">{lofi.title}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="px-2 py-0.5 text-xs rounded-full font-medium"
                  style={{ background: "rgba(139,92,246,0.25)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" }}>
                  {lofi.category}
                </span>
                {lofi.audioUrl && <span className="text-xs text-white/40">🔊</span>}
              </div>
            </div>
          </Link>
        );
      })}
    </main>
  );
}