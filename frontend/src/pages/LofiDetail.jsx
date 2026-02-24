import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaVolumeHigh } from "react-icons/fa6";
import { TfiTimer } from "react-icons/tfi";
import { MessageCircle } from "lucide-react";
import rainSound from '../assets/audio/rain-sound.mp3';
import cafeSound from '../assets/audio/cafe-sound.mp3';
import streetSound from '../assets/audio/street-sound.mp3';
import YouTube from "react-youtube";
import SoundPanel from "../components/SoundPanel";
import TimerPanel from "../components/TimerPanel";
import ChatWindow from "../components/ChatPanel";

export default function LofiDetail() {
  const { id } = useParams();
  const [lofi, setLofi] = useState(null);

  const [audioVolume, setAudioVolume] = useState(() => {
    const saved = localStorage.getItem("audioVolume");
    return saved !== null ? Number(saved) : 10;
  });
  const [youtubeVolume, setYoutubeVolume] = useState(() => {
    const saved = localStorage.getItem("youtubeVolume");
    return saved !== null ? Number(saved) : 10;
  });
  const [rainVolume, setRainVolume] = useState(() => {
    const saved = localStorage.getItem("rainVolume");
    return saved !== null ? Number(saved) : 0;
  });
  const [cafeVolume, setCafeVolume] = useState(() => {
    const saved = localStorage.getItem("cafeVolume");
    return saved !== null ? Number(saved) : 0;
  });
  const [streetVolume, setStreetVolume] = useState(() => {
    const saved = localStorage.getItem("streetVolume");
    return saved !== null ? Number(saved) : 0;
  });

  const [panelOpen, setPanelOpen] = useState(false);
  const [timerPanelOpen, setTimerPanelOpen] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [isYouTubeReady, setIsYouTubeReady] = useState(false);
  const [userInteraction, setUserInteraction] = useState(false);

  // iOS/Safari detection — tek yer, doğru regex
  const [isSafari, setIsSafari] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Landscape detection for mobile
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    // Safari: Chrome veya Android değil, ama Safari içeren
    const safari = /^((?!chrome|android).)*safari/i.test(ua);
    // iOS: iPhone, iPad, iPod (modern iPad'ler navigator.platform = MacIntel kullanıyor,
    // bu yüzden touch + MacIntel de kontrol ediyoruz)
    const ios =
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsSafari(safari || ios);
    setIsIOS(ios);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      const mobile = window.innerWidth < 1024;
      const landscape = window.innerWidth > window.innerHeight;
      setIsMobile(mobile);
      setIsLandscape(mobile && landscape);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  const audioRef = useRef(null);
  const rainAudioRef = useRef(null);
  const cafeAudioRef = useRef(null);
  const streetAudioRef = useRef(null);
  const youtubePlayerRef = useRef(null);

  const [audioMuted, setAudioMuted] = useState(() => JSON.parse(localStorage.getItem("audioMuted")) || false);
  const [youtubeMuted, setYoutubeMuted] = useState(() => JSON.parse(localStorage.getItem("youtubeMuted")) || false);
  const [streetMuted, setStreetMuted] = useState(() => JSON.parse(localStorage.getItem("streetMuted")) || false);
  const [rainMuted, setRainMuted] = useState(() => JSON.parse(localStorage.getItem("rainMuted")) || false);
  const [cafeMuted, setCafeMuted] = useState(() => JSON.parse(localStorage.getItem("cafeMuted")) || false);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    fetch(`https://focusflow-7znc.onrender.com/lofis/${id}`)
      .then((res) => res.json())
      .then((data) => setLofi(data))
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    window.onYouTubeIframeAPIReady = () => { setIsYouTubeReady(true); };
  }, []);

  useEffect(() => {
    if (lofi?.audioUrl && audioRef.current) {
      audioRef.current.volume = audioVolume / 100;
      setAudioMuted(audioVolume === 0);
      localStorage.setItem("audioVolume", audioVolume);
    }
  }, [audioVolume, lofi]);

  useEffect(() => {
    if (lofi?.videoUrl && youtubePlayerRef.current && isYouTubeReady) {
      try {
        // iOS'ta setVolume çalışmaz — sadece mute/unmute
        if (!isIOS) {
          youtubePlayerRef.current.setVolume(youtubeVolume);
        }
        if (youtubeVolume === 0) {
          youtubePlayerRef.current.mute();
          setYoutubeMuted(true);
        } else {
          youtubePlayerRef.current.unMute();
          setYoutubeMuted(false);
        }
      } catch (error) { console.log(error); }
    }
    localStorage.setItem("youtubeVolume", youtubeVolume);
  }, [youtubeVolume, lofi, isYouTubeReady, isIOS]);

  useEffect(() => {
    if (rainAudioRef.current) { rainAudioRef.current.volume = rainVolume / 100; setRainMuted(rainVolume === 0); }
    localStorage.setItem("rainVolume", rainVolume);
  }, [rainVolume]);

  useEffect(() => {
    if (streetAudioRef.current) { streetAudioRef.current.volume = streetVolume / 100; setStreetMuted(streetVolume === 0); }
    localStorage.setItem("streetVolume", streetVolume);
  }, [streetVolume]);

  useEffect(() => {
    if (cafeAudioRef.current) { cafeAudioRef.current.volume = cafeVolume / 100; setCafeMuted(cafeVolume === 0); }
    localStorage.setItem("cafeVolume", cafeVolume);
  }, [cafeVolume]);

  const handleUserInteraction = () => {
    if (!userInteraction) {
      setUserInteraction(true);
      // Audio files
      if (audioRef.current && audioVolume > 0) audioRef.current.play().catch(() => { });
      if (rainAudioRef.current && rainVolume > 0) rainAudioRef.current.play().catch(() => { });
      if (streetAudioRef.current && streetVolume > 0) streetAudioRef.current.play().catch(() => { });
      if (cafeAudioRef.current && cafeVolume > 0) cafeAudioRef.current.play().catch(() => { });
      // Safari/iOS: YouTube play (playVideo() is NOT a promise, no .catch needed)
      if (youtubePlayerRef.current && isSafari) {
        try { youtubePlayerRef.current.playVideo(); } catch (e) { console.log(e); }
      }
    } else {
      // Sonraki dokunuşlarda da Safari'de play tetikle (video durmuşsa)
      if (isSafari && youtubePlayerRef.current) {
        try {
          const state = youtubePlayerRef.current.getPlayerState();
          // -1: unstarted, 2: paused
          if (state === -1 || state === 2) {
            youtubePlayerRef.current.playVideo();
          }
        } catch (e) { }
      }
    }
  };

  const handleTogglePanel = () => {
    if (isMobile) { setTimerPanelOpen(false); setChatPanelOpen(false); }
    setPanelOpen(!panelOpen);
  };

  const handleToggleTimer = () => {
    if (isMobile) { setPanelOpen(false); setChatPanelOpen(false); }
    setTimerPanelOpen(!timerPanelOpen);
  };

  const handleToggleChat = () => {
    if (isMobile) { setPanelOpen(false); setTimerPanelOpen(false); }
    setChatPanelOpen(!chatPanelOpen);
  };

  const handleVolumeChange = (ref, val, setVol, setMuted, storageKey) => {
    setVol(val);
    if (storageKey) localStorage.setItem(storageKey, val.toString());
    if (val === 0) {
      setMuted(true);
      // YouTube player mı?
      if (ref?.current?.mute) {
        try { ref.current.mute(); } catch (e) { }
      } else if (ref?.current?.pause) {
        ref.current.pause();
      }
    } else {
      setMuted(false);
      if (ref?.current?.unMute) {
        // YouTube player
        try {
          ref.current.unMute();
          if (!isIOS) ref.current.setVolume(val);
        } catch (e) { }
      } else if (ref?.current) {
        // HTML audio element
        ref.current.volume = val / 100;
        if (userInteraction) ref.current.play().catch(() => { });
      }
    }
  };

  const handleYouTubeReady = (event) => {
    try {
      youtubePlayerRef.current = event.target;
      // Başlangıçta muted yap (autoplay politikası)
      event.target.mute();
      // iOS/Safari: tıklamayı bekle; desktop: direkt oynat
      if (!isSafari) {
        event.target.playVideo();
      }
      setIsYouTubeReady(true);
      // Sesini ayarla
      if (!isIOS) {
        event.target.setVolume(youtubeVolume);
      }
      if (youtubeVolume === 0 || youtubeMuted) {
        event.target.mute();
      } else {
        event.target.unMute();
      }
    } catch (error) { console.log(error); }
  };

  if (!lofi) return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  );

  const isYouTubeVideo = !!lofi.videoUrl;
  const videoId = isYouTubeVideo ? getYouTubeId(lofi.videoUrl) : null;

  return (
    <main
      className="relative w-full h-screen bg-gray-900 overflow-hidden"
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {/* ── Background ── */}
      {isYouTubeVideo && videoId ? (
        <>
          <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center pointer-events-none">
            <YouTube
              videoId={videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                  controls: 0,
                  modestbranding: 1,
                  loop: 1,
                  playlist: videoId,
                  playsinline: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3
                },
              }}
              onReady={handleYouTubeReady}
              onError={(e) => console.log(e)}
              className="w-full h-full"
              iframeClassName="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto scale-[1.3] pointer-events-none"
            />
          </div>
          <div className="absolute inset-0 bg-slate-950/40 z-10 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
        </>
      ) : (
        <>
          <img src={lofi.coverImg} alt={lofi.title} className="absolute inset-0 w-full h-full object-cover z-0" />
          <div className="absolute inset-0 bg-slate-950/40 z-10 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
        </>
      )}

      {/* ── Now Playing ── */}
      <div className="relative z-20 max-w-2xl mx-auto px-6 pt-8 sm:pt-12 text-white">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <div className="text-white/40 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">Now Playing</div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight drop-shadow-2xl">
            {lofi.title}
          </h1>
          <div className="mt-4 w-12 h-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full opacity-50" />
        </div>

        {/* Safari'de video başlatma ipucu */}
        {isSafari && !userInteraction && (
          <div className="flex flex-col items-center mt-8 animate-bounce">
            <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
              <p className="text-center text-white text-xs font-black uppercase tracking-[0.2em]">
                Tap to Start Focus 🎧
              </p>
            </div>
          </div>
        )}

        {/* Audio elements */}
        {lofi.audioUrl && (
          <audio ref={audioRef} autoPlay loop muted={audioMuted}
            onCanPlay={() => {
              if (audioRef.current) {
                audioRef.current.volume = audioVolume / 100;
                audioRef.current.play().catch(() => { });
              }
            }}>
            <source src={lofi.audioUrl} type="audio/mp3" />
          </audio>
        )}
        <audio ref={rainAudioRef} loop muted={rainMuted}
          onCanPlay={() => { if (rainAudioRef.current) rainAudioRef.current.volume = rainVolume / 100; }}>
          <source src={rainSound} type="audio/mp3" />
        </audio>
        <audio ref={streetAudioRef} loop muted={streetMuted}
          onCanPlay={() => { if (streetAudioRef.current) streetAudioRef.current.volume = streetVolume / 100; }}>
          <source src={streetSound} type="audio/mp3" />
        </audio>
        <audio ref={cafeAudioRef} loop muted={cafeMuted}
          onCanPlay={() => { if (cafeAudioRef.current) cafeAudioRef.current.volume = cafeVolume / 100; }}>
          <source src={cafeSound} type="audio/mp3" />
        </audio>
      </div>

      {/* ── DESKTOP: Sol üst toolbar ── */}
      <div className="hidden lg:flex absolute top-4 left-4 z-30 flex-col items-center gap-2">
        <button
          className={`group relative w-14 h-14 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl transition-all flex items-center justify-center
            ${panelOpen ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/40" : "bg-white/10 hover:bg-white/20"}`}
          onClick={handleTogglePanel}
        >
          <FaVolumeHigh className="w-5 h-5 text-white" />
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Sound Mixer
          </div>
        </button>
        <button
          className={`group relative w-14 h-14 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl transition-all flex items-center justify-center
            ${timerPanelOpen ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/40" : "bg-white/10 hover:bg-white/20"}`}
          onClick={handleToggleTimer}
        >
          <TfiTimer className="w-5 h-5 text-white" />
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Timer
          </div>
        </button>
      </div>

      {/* ── MOBİL: FIXED bottom nav (her zaman görünür) ── */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 transition-transform duration-500 ${isLandscape ? "translate-y-full" : "translate-y-0"}`}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="mx-6 mb-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around py-4 px-2">
          <button
            onClick={handleTogglePanel}
            className="flex flex-col items-center gap-1.5 px-4 relative"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${panelOpen ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/40" : "bg-white/5 hover:bg-white/10"
              }`}>
              <FaVolumeHigh className={`w-5 h-5 transition-colors ${panelOpen ? "text-white" : "text-white/60"}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${panelOpen ? "text-emerald-400" : "text-white/30"}`}>Mixer</span>
            {panelOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={handleToggleTimer}
            className="flex flex-col items-center gap-1.5 px-4 relative"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${timerPanelOpen ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/40" : "bg-white/5 hover:bg-white/10"
              }`}>
              <TfiTimer className={`w-5 h-5 transition-colors ${timerPanelOpen ? "text-white" : "text-white/60"}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${timerPanelOpen ? "text-emerald-400" : "text-white/30"}`}>Timer</span>
            {timerPanelOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400" />}
          </button>

          <button
            onClick={handleToggleChat}
            className="flex flex-col items-center gap-1.5 px-4 relative"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${chatPanelOpen ? "bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-emerald-500/40" : "bg-white/5 hover:bg-white/10"
              }`}>
              <MessageCircle className={`w-5 h-5 transition-colors ${chatPanelOpen ? "text-white" : "text-white/60"}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${chatPanelOpen ? "text-emerald-400" : "text-white/30"}`}>Chat</span>
            {chatPanelOpen && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400" />}
          </button>
        </div>
      </div>

      {/* ── MOBİL LANDSCAPE: Sağ kenar dikey toolbar ── */}
      {isLandscape && (
        <div className="lg:hidden fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
          <button
            onClick={handleTogglePanel}
            className={`w-11 h-11 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl flex items-center justify-center transition-all ${panelOpen ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40" : "bg-black/50"
              }`}
          >
            <FaVolumeHigh className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleToggleTimer}
            className={`w-11 h-11 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl flex items-center justify-center transition-all ${timerPanelOpen ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40" : "bg-black/50"
              }`}
          >
            <TfiTimer className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleToggleChat}
            className={`w-11 h-11 backdrop-blur-xl rounded-xl border border-white/20 shadow-xl flex items-center justify-center transition-all ${chatPanelOpen ? "bg-gradient-to-br from-purple-500/40 to-pink-500/40" : "bg-black/50"
              }`}
          >
            <MessageCircle className="w-4 h-4 text-white" />
          </button>
        </div>
      )}

      {/* ── Panels ── */}
      <SoundPanel
        panelOpen={panelOpen}
        isYouTubeVideo={isYouTubeVideo}
        isIOS={isIOS}
        youtubeMuted={youtubeMuted} setYoutubeMuted={setYoutubeMuted}
        youtubeVolume={youtubeVolume} setYoutubeVolume={setYoutubeVolume}
        audioMuted={audioMuted} setAudioMuted={setAudioMuted}
        audioVolume={audioVolume} setAudioVolume={setAudioVolume}
        rainMuted={rainMuted} setRainMuted={setRainMuted}
        rainVolume={rainVolume} setRainVolume={setRainVolume}
        cafeMuted={cafeMuted} setCafeMuted={setCafeMuted}
        cafeVolume={cafeVolume} setCafeVolume={setCafeVolume}
        streetMuted={streetMuted} setStreetMuted={setStreetMuted}
        streetVolume={streetVolume} setStreetVolume={setStreetVolume}
        handleVolumeChange={handleVolumeChange}
        youtubePlayerRef={youtubePlayerRef}
        audioRef={audioRef} rainAudioRef={rainAudioRef}
        cafeAudioRef={cafeAudioRef} streetAudioRef={streetAudioRef}
        onClose={() => setPanelOpen(false)}
      />

      <TimerPanel panelOpen={timerPanelOpen} onClose={() => setTimerPanelOpen(false)} />

      <ChatWindow panelOpen={chatPanelOpen} onClose={() => setChatPanelOpen(false)} />

      {/* Desktop chat button */}
      <div className="hidden lg:block absolute bottom-6 right-6 z-30">
        <button
          onClick={() => setChatPanelOpen(!chatPanelOpen)}
          className={`group relative w-14 h-14 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl transition-all flex items-center justify-center
            ${chatPanelOpen ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-purple-400/40" : "bg-white/10 hover:bg-white/20"}`}
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>
    </main>
  );
}