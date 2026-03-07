import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { Search, Play, Mic, Bell, AudioLines } from "lucide-react";
import { io } from "socket.io-client";
import LofiList, { getCoverImage } from "../components/LofiList";

const socket = io("https://focusflow-7znc.onrender.com");
const categories = ["All", "Cafe", "Night", "Rain", "Study"];
const categoryIcons = { All: "🎵", Cafe: "☕", Night: "🌙", Rain: "🌧️", Study: "📚" };


export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [lofies, setLofies] = useState([]); // Database'den dolacak
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-carousel effect for Hero Banner
  useEffect(() => {
    if (lofies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(lofies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [lofies]); // Make sure this tracks the lofies array properly

  useEffect(() => {
    checkUserStatus();

    fetch(`https://focusflow-7znc.onrender.com/lofis`)
      .then((res) => res.json())
      .then((data) => {
        // Doğrudan kendi backend verilerini yüklüyoruz.
        setLofies(data);
      })
      .catch((err) => console.log(err));

    socket.on("lofiCreated", (newLofi) => {
      setLofies((prev) => [newLofi, ...prev]);
    });
    socket.on("lofiUpdated", (updated) => setLofies((prev) => prev.map((l) => (l._id === updated._id ? updated : l))));
    socket.on("lofiDeleted", (id) => setLofies((prev) => prev.filter((l) => l._id !== id)));

    return () => socket.off();
  }, []);

  const heroLofi = lofies[heroIndex] || null;

  const checkUserStatus = async () => {
    const token = localStorage.getItem('lofi_token');
    if (!token) return;
    try {
      const response = await fetch(`https://focusflow-7znc.onrender.com/api/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) { console.log('User check error:', error); }
  };

  const handleUserClick = () => navigate(user ? '/' : '/login');
  const getUserInitial = () => user?.username?.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white font-sans">

      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* ── PREMIUM FLOATING NAV ── */}
        <div className="absolute top-4 left-0 right-0 z-50 px-4 md:px-8 pointer-events-none flex justify-center">
          <nav className="w-full max-w-[1800px] flex items-center justify-between px-5 py-3 md:px-6 md:py-3.5 bg-[#0f0f0f]/80 backdrop-blur-2xl rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.9)] pointer-events-auto">

            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)] relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-black/10" />
                <AudioLines strokeWidth={2.5} className="w-5 h-5 text-black z-10" />
              </div>
              <span className="hidden sm:block text-white font-black text-[20px] tracking-tight drop-shadow-md">
                Focus<span className="text-emerald-400">Flow</span>
              </span>
            </div>

            {/* Search Bar (Center) */}
            <div className="flex-1 max-w-xl mx-4 md:mx-6 flex items-center">
              <div className="relative group w-full flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-4 h-4 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search flows..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-2.5 rounded-xl text-white placeholder:text-white/30 text-[14px] font-medium outline-none transition-all bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleUserClick}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 bg-white/5 hover:bg-white/10 border border-white/5 group relative overflow-hidden"
              >
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                {user
                  ? <span className="relative z-10 text-[14px] font-black text-emerald-400 group-hover:text-emerald-300">{getUserInitial()}</span>
                  : <FaUser className="relative z-10 w-4 h-4 text-white/70 group-hover:text-white" />}
              </button>
            </div>
          </nav>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative pt-[68px]">

          {/* ── HERO BANNER CAROUSEL ── */}
          <div className="relative w-full h-[55vh] md:h-[60vh] flex flex-col justify-end group mt-12 px-4 md:px-8 max-w-[1800px] mx-auto">
            {heroLofi ? (
              <div className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/50 cursor-pointer" onClick={() => navigate(`/${heroLofi._id}`)}>

                {/* Fade Transition Backgrounds wrapping the top 5 lofis */}
                {lofies.slice(0, 5).map((lofi, idx) => (
                  <img
                    key={lofi._id}
                    src={getCoverImage(lofi)}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1.5s] ease-in-out group-hover:scale-[1.02] ${idx === heroIndex ? "opacity-100 z-0" : "opacity-0 scale-105 -z-10"
                      }`}
                    alt="Hero Background"
                    onError={(e) => {
                      if (e.target.src.includes('maxresdefault.jpg')) {
                        e.target.src = e.target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                      }
                    }}
                  />
                ))}

                {/* Internal Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-[#0a0a0a]/10 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-10" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-20 px-8 md:px-12 pb-10 flex flex-col gap-3">

                  {/* Redesigned Premium "Featured" Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center gap-2 px-3.5 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[11px] uppercase tracking-[0.2em] font-bold rounded-full shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                      FEATURED FLOW
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-widest leading-[1.1] drop-shadow-2xl line-clamp-2 max-w-4xl transition-all duration-700">
                    {heroLofi.title}
                  </h1>

                  <div className="flex items-center gap-3 mt-1 opacity-90">
                    <span className="text-sm font-bold text-white drop-shadow-md flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-500 flex items-center justify-center text-[10px] text-black font-black">
                        FF
                      </div>
                      {heroLofi.author || "FocusFlow Mix"}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-[14px] font-bold text-emerald-400 tracking-wide drop-shadow-md">
                      {heroLofi.category || "Chill"}
                    </span>
                  </div>

                  <button
                    className="mt-4 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-emerald-400 hover:border-emerald-400 hover:text-black hover:shadow-[0_0_25px_rgba(52,211,153,0.8)] py-3.5 px-10 rounded-full text-sm font-black w-fit transition-all duration-300 flex items-center justify-center gap-2.5 tracking-[0.1em] shadow-xl hover:-translate-y-1 active:scale-95 group"
                  >
                    <Play className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" />
                    PLAY MIX
                  </button>

                  {/* Carousel Pagination Dots */}
                  <div className="absolute bottom-6 right-8 flex gap-2">
                    {lofies.slice(0, 5).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === heroIndex ? "w-6 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "w-1.5 bg-white/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl md:rounded-3xl bg-[#111] animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* ── DISCOVER SECTION (Categories + Grid) ── */}
          <div className="px-4 md:px-8 pb-10 relative z-20 mt-8 max-w-[1800px] mx-auto">

            {/* Beautiful Pills for Categories */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-[15px] font-semibold tracking-wide transition-all duration-300 border ${category === cat
                    ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                    : "bg-[#151515] text-white/50 hover:text-white hover:bg-[#222] border-[#222]"
                    }`}
                >
                  <span className={`text-base transition-opacity ${category === cat ? "opacity-100" : "opacity-70"}`}>
                    {categoryIcons[cat]}
                  </span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            <LofiList search={search} category={category} lofies={lofies} />
          </div>

          {/* ── FOOTER ── */}
          <footer className="w-full mt-10 pt-6 pb-6 border-t border-white/5 flex flex-col items-center justify-center gap-3 opacity-60">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-gray-400">
              <span className="cursor-pointer hover:text-emerald-400 transition-colors">About</span>
              <span className="cursor-pointer hover:text-emerald-400 transition-colors">Community</span>
              <span className="cursor-pointer hover:text-emerald-400 transition-colors">Guidelines</span>
              <span className="cursor-pointer hover:text-emerald-400 transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-emerald-400 transition-colors">Terms of Service</span>
            </div>

            <p className="text-gray-500 text-[11px] font-medium tracking-widest uppercase">
              © 2026 Göktuğ Gök. Tutkuyla tasarlandı.
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
}
