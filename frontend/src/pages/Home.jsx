import LofiList from "../components/LofiList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { Search } from "lucide-react";

const categories = ["All", "Cafe", "Night", "Rain", "Study"];

const categoryEmojis = { All: "🎵", Cafe: "☕", Night: "🌙", Rain: "🌧️", Study: "📚" };

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => { checkUserStatus(); }, []);

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
    <div className="flex h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1535 40%, #24243e 100%)" }}>

      {/* ── DESKTOP Sidebar ── */}
      <div className="relative hidden lg:flex w-16 flex-shrink-0 flex-col items-center justify-center"
        style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Logo dikey */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-white/70 text-xs tracking-[0.35em] whitespace-nowrap origin-center rotate-180 [writing-mode:vertical-lr] font-light">
            FocusFlow
          </h2>
        </div>
        {/* User butonu */}
        <button
          onClick={handleUserClick}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3))", border: "1px solid rgba(139,92,246,0.4)" }}
        >
          {user
            ? <span className="text-purple-200 text-sm font-semibold">{getUserInitial()}</span>
            : <FaUser className="w-4 h-4 text-purple-300" />}
        </button>
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-2">
            {/* Logo icon */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
              <span className="text-white text-xs font-bold">FF</span>
            </div>
            <h1 className="text-white font-semibold tracking-wide text-base">FocusFlow</h1>
          </div>
          <button
            onClick={handleUserClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.25), rgba(236,72,153,0.25))", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            {user
              ? <span className="text-purple-200 text-sm font-bold">{getUserInitial()}</span>
              : <FaUser className="w-4 h-4 text-purple-300" />}
          </button>
        </header>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">

            {/* Hero text — sadece desktop */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-white/90 text-2xl font-light mb-1">
                Merhaba 👋
              </h2>
              <p className="text-white/40 text-sm">Odaklanmak için bir lofi seç</p>
            </div>

            {/* Arama */}
            <div className="mb-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <input
                type="text"
                placeholder="Lofi ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-5 py-3 rounded-xl text-white placeholder:text-white/30 text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => e.target.style.borderColor = "rgba(139,92,246,0.6)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Kategoriler */}
            <div className="mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 w-max sm:w-auto sm:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all duration-200 font-medium"
                    style={category === cat ? {
                      background: "linear-gradient(135deg, #7c3aed, #db2777)",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(124,58,237,0.35)"
                    } : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    <span className="text-sm">{categoryEmojis[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Lofi listesi */}
            <LofiList search={search} category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}
