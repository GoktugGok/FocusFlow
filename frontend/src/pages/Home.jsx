import LofiList from "../components/LofiList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import { Search } from "lucide-react";

const categories = ["All", "Cafe", "Night", "Rain", "Study"];

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    const token = localStorage.getItem('lofi_token');

    if (!token) return;

    try {
      const response = await fetch(`https://focusflow-7znc.onrender.com/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.log('User check error:', error);
    }
  };

  const handleUserClick = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  const getUserInitial = () => {
    return user?.username?.charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">

      {/* Sidebar — sadece desktop */}
      <div className="relative hidden lg:flex w-16 bg-white border-r border-gray-200/80 shadow-sm flex-col items-center justify-center flex-shrink-0">
        {/* FocusFlow Logo - Dikey yazı */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-gray-800 tracking-[0.2em] whitespace-nowrap origin-center rotate-180 [writing-mode:vertical-lr]">
            FocusFlow
          </h2>
        </div>

        {/* User Button - Alt kısım */}
        <button
          onClick={handleUserClick}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center group"
        >
          {user ? (
            <span className="text-purple-700 text-sm">{getUserInitial()}</span>
          ) : (
            <FaUser className="w-4 h-4 text-purple-600" />
          )}
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200/80 shadow-sm flex-shrink-0">
          <h1 className="text-lg font-semibold tracking-widest text-gray-800">FocusFlow</h1>
          <button
            onClick={handleUserClick}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm flex items-center justify-center"
          >
            {user ? (
              <span className="text-purple-700 text-sm font-bold">{getUserInitial()}</span>
            ) : (
              <FaUser className="w-4 h-4 text-purple-600" />
            )}
          </button>
        </header>

        {/* İçerik alanı */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

            {/* Arama kutusu */}
            <div className="mb-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Lofi ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-5 py-3 bg-white rounded-xl border border-gray-200/80 text-gray-800 placeholder:text-gray-400 shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-300 transition-all text-sm"
              />
            </div>

            {/* Kategori filtreleri */}
            <div className="mb-5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex gap-2 w-max sm:w-auto sm:justify-center border px-3 py-1 rounded-full bg-white shadow-sm">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${category === cat
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
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
