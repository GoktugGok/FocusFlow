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

export default function LofiList({ search, category }){  // ✅ 1. category prop'u zaten var
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

    return(
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredLofies.map((lofi) => {  // ✅ 3. lofies yerine filteredLofies kullan
            const coverImage = getCoverImage(lofi);
            
            return (
              <Link key={lofi._id} to={lofi._id} className="rounded-xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                
                {/* Resim kısmı - YouTube thumbnail veya custom cover */}
                <div className="w-full h-42 bg-gray-200 relative">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={lofi.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Resim yüklenemezse fallback
                        e.target.src = "/default-cover.jpg";
                      }}
                    />
                  ) : (
                    // Resim yoksa placeholder
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🎵</span>
                    </div>
                  )}
                  
                  {/* YouTube ikonu (eğer videoUrl varsa) */}
                  {lofi.videoUrl && (
                    <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* İçerik kısmı */}
                <div className="px-4 py-3 border flex-1 flex flex-col justify-between bg-white ">
                  <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">{lofi.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{lofi.artist}</p>
                  <div className="flex justify-between items-center">
                    <span className="p-1 text-xs bg-purple-100 text-purple-800  rounded-full">
                      {lofi.category}
                    </span>
                    {lofi.audioUrl && (
                      <span className="text-xs text-gray-500">🔊</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </main>
    );
}