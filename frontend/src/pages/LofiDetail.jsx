import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaVolumeHigh } from "react-icons/fa6";
import { TfiTimer } from "react-icons/tfi";
import {MessageCircle } from "lucide-react";
import rainSound from '../assets/audio/rain-sound.mp3';
import cafeSound from '../assets/audio/cafe-sound.mp3';
import streetSound from '../assets/audio/street-sound.mp3';
import YouTube from "react-youtube";
import SoundPanel from "../components/SoundPanel";
import TimerPanel from "../components/TimerPanel";
import ChatWindow from "../components/ChatPanel";

export default function LofiDetail() {
  // ROUTER PARAMS
  const { id } = useParams();
  const [lofi, setLofi] = useState(null);

  // STATE: Volume
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

  // STATE: Panel & YouTube
  const [panelOpen, setPanelOpen] = useState(false);
  const [timerPanelOpen, setTimerPanelOpen] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(false);
  const [isYouTubeReady, setIsYouTubeReady] = useState(false);
  
  // 🆕 Safari için eklenecek tek state
  const [userInteraction, setUserInteraction] = useState(false);

  // REFS
  const audioRef = useRef(null);
  const rainAudioRef = useRef(null);
  const cafeAudioRef = useRef(null);
  const streetAudioRef = useRef(null);
  const youtubePlayerRef = useRef(null);

  // STATE: Muted
  const [audioMuted, setAudioMuted] = useState(() => JSON.parse(localStorage.getItem("audioMuted")) || false);
  const [youtubeMuted, setYoutubeMuted] = useState(() => JSON.parse(localStorage.getItem("youtubeMuted")) || false);
  const [streetMuted, setStreetMuted] = useState(() => JSON.parse(localStorage.getItem("streetMuted")) || false);
  const [rainMuted, setRainMuted] = useState(() => JSON.parse(localStorage.getItem("rainMuted")) || false);
  const [cafeMuted, setCafeMuted] = useState(() => JSON.parse(localStorage.getItem("cafeMuted")) || false);

  // HELPERS
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };
  
  // FETCH LOFI DATA
  useEffect(() => {
    fetch(`https://focusflow-7znc.onrender.com/lofis/${id}`)
      .then((res) => res.json())
      .then((data) => setLofi(data))
      .catch((err) => console.log(err));
  }, [id]);

  // 🆕 YouTube API yükleme (ilk kodundaki gibi)
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("✅ YouTube API ready!");
      setIsYouTubeReady(true);
    };
  }, []);

  // VOLUME EFFECTS (ilk kodundaki gibi)
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
        youtubePlayerRef.current.setVolume(youtubeVolume);
        setYoutubeMuted(youtubeVolume === 0);
      } catch (error) {
        console.log("YouTube player not ready yet:", error);
      }
    }
    localStorage.setItem("youtubeVolume", youtubeVolume);
  }, [youtubeVolume, lofi, isYouTubeReady]);

  useEffect(() => {
    if (rainAudioRef.current) {
      rainAudioRef.current.volume = rainVolume / 100;
      setRainMuted(rainVolume === 0);
    }
    localStorage.setItem("rainVolume", rainVolume);
  }, [rainVolume]);

  useEffect(() => {
    if (streetAudioRef.current) {
      streetAudioRef.current.volume = streetVolume / 100;
      setStreetMuted(streetVolume === 0);
    }
    localStorage.setItem("streetVolume", streetVolume);
  }, [streetVolume]);

  useEffect(() => {
    if (cafeAudioRef.current) {
      cafeAudioRef.current.volume = cafeVolume / 100;
      setCafeMuted(cafeVolume === 0);
    }
    localStorage.setItem("cafeVolume", cafeVolume);
  }, [cafeVolume]);

  // 🆕 Safari için kullanıcı etkileşimi
  const handleUserInteraction = () => {
    if (!userInteraction) {
      setUserInteraction(true);
      
      // Tüm sesleri başlat
      if (audioRef.current && audioVolume > 0) {
        audioRef.current.play().catch(() => {});
      }
      if (rainAudioRef.current && rainVolume > 0) {
        rainAudioRef.current.play().catch(() => {});
      }
      if (streetAudioRef.current && streetVolume > 0) {
        streetAudioRef.current.play().catch(() => {});
      }
      if (cafeAudioRef.current && cafeVolume > 0) {
        cafeAudioRef.current.play().catch(() => {});
      }
    }
  };

  // PANEL
  const handleTogglePanel = () => setPanelOpen(!panelOpen);

  // VOLUME CHANGE (ilk kodundaki gibi)
  const handleVolumeChange = (ref, val, setVol, setMuted, storageKey) => {
    setVol(val);
    if (storageKey) {
        localStorage.setItem(storageKey, val.toString());
    }
    if(val === 0){
        setMuted(true);
        if (ref?.current && !ref.current.getVolume) { 
            ref.current.pause();
        }
    } else {
        setMuted(false);
        if(ref?.current){
            ref.current.volume = val / 100;
            if (!ref.current.getVolume) { 
                ref.current.play().catch(() => {});
            }
        }
    }
  };

  // YOUTUBE READY (ilk kodundaki gibi)
  const handleYouTubeReady = (event) => {
    try {
      youtubePlayerRef.current = event.target;
      event.target.mute();
      event.target.playVideo();
      setIsYouTubeReady(true);
      event.target.setVolume(youtubeVolume);
      if (youtubeVolume === 0 || youtubeMuted) {
        event.target.mute();
      } else {
        event.target.unMute();
      }
    } catch (error) {
      console.log("Error initializing YouTube player:", error);
    }
  };

  // RENDER
  if (!lofi) return <div>Loading...</div>;

  const isYouTubeVideo = !!lofi.videoUrl;
  const videoId = isYouTubeVideo ? getYouTubeId(lofi.videoUrl) : null;

  return (
    <main 
      className="relative w-full h-screen bg-gray-900 overflow-hidden"
      // 🆕 Safari için tıklama yakalama
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      {isYouTubeVideo && videoId ? (
        <>
          <div className="absolute inset-0 w-full h-full z-0 flex items-center justify-center">
            <YouTube
              videoId={videoId}
              opts={{
                playerVars: {
                  autoplay: 1,
                  mute:1,
                  controls: 0,
                  modestbranding: 1,
                  loop: 1,
                  playlist: videoId,
                  playsinline: 1
                },
              }}
              onReady={handleYouTubeReady}
              onError={(e) => console.log("YouTube player error:", e)}
              className="w-full h-full object-cover"
              iframeClassName="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </>
      ) : (
        <>
          <img
            src={lofi.coverImg}
            alt={lofi.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </>
      )}

      <div className="relative z-20 max-w-lg mx-auto p-6 text-white">
        <div className="">
          <div className="text-white/70 text-sm mb-2">NOW PLAYING</div>
          <h1 className="text-sm shadow-xl border-gray-800 rounded text-center font-bold text-white bg-black/30 py-2 px-3 border border-white/20">
            {lofi.title}
          </h1>
        </div>
        {lofi.audioUrl && (
          <audio
            ref={audioRef}
            autoPlay
            loop
            muted={audioMuted}
            onCanPlay={() => {
              if (audioRef.current) {
                audioRef.current.volume = audioVolume / 100;
                audioRef.current.play().catch(err => console.log(err));
              }
            }}
          >
            <source src={lofi.audioUrl} type="audio/mp3"/>
          </audio>
        )}
        <audio 
          ref={rainAudioRef} 
          autoPlay 
          loop
          type="audio/mp3"
          muted={rainMuted}
          onCanPlay={() => {
            if(rainAudioRef.current){
              rainAudioRef.current.volume = rainVolume / 100;
              rainAudioRef.current.play().catch(() => {})
            }
          }}
        >
          <source src={rainSound} type="audio/mp3" />
        </audio>
        <audio 
          ref={streetAudioRef} 
          autoPlay 
          loop
          type="audio/mp3"
          muted={streetMuted}
          onCanPlay={() => {
            if(streetAudioRef.current){
              streetAudioRef.current.volume = streetVolume / 100;
              streetAudioRef.current.play().catch(() => {})
            }
          }}
        >
          <source src={streetSound} type="audio/mp3" />
        </audio>
        <audio 
          ref={cafeAudioRef} 
          autoPlay 
          loop
          type="audio/mp3"
          muted={cafeMuted}
          onCanPlay={() => {
            if(cafeAudioRef.current){
              cafeAudioRef.current.volume = cafeVolume / 100;
              cafeAudioRef.current.play().catch(() => {})
            }
          }}
        >
          <source src={cafeSound} type="audio/mp3" />
        </audio>
      </div>
      <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-md rounded-xl text-white flex flex-col items-center gap-2">
        <button className={`group relative w-14 h-14 backdrop-blur-xl rounded border border-white/20 shadow-2xl transition-all flex items-center justify-center
        ${panelOpen
          ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
          : "bg-white/10 hover:bg-white/20"}
      `} onClick={handleTogglePanel}>
          <FaVolumeHigh  className="w-5 h-5 text-white" />
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Sound Mixer
          </div>
        </button>

        <button className={`group relative w-14 h-14 backdrop-blur-xl rounded border border-white/20 shadow-2xl transition-all flex items-center justify-center
          ${timerPanelOpen
            ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            : "bg-white/10 hover:bg-white/20"}
        `} onClick={() => setTimerPanelOpen(!timerPanelOpen)}>
        <TfiTimer className="w-5 h-5 text-white" />
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Timer
          </div>
        </button>

      </div>

      <SoundPanel
        panelOpen={panelOpen}
        isYouTubeVideo={isYouTubeVideo}
        youtubeMuted={youtubeMuted}
        setYoutubeMuted={setYoutubeMuted}
        youtubeVolume={youtubeVolume}
        setYoutubeVolume={setYoutubeVolume}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        audioVolume={audioVolume}
        setAudioVolume={setAudioVolume}
        rainMuted={rainMuted}
        setRainMuted={setRainMuted}
        rainVolume={rainVolume}
        setRainVolume={setRainVolume}
        cafeMuted={cafeMuted}
        setCafeMuted={setCafeMuted}
        cafeVolume={cafeVolume}
        setCafeVolume={setCafeVolume}
        streetMuted={streetMuted}
        setStreetMuted={setStreetMuted}
        streetVolume={streetVolume}
        setStreetVolume={setStreetVolume}
        handleVolumeChange={handleVolumeChange}
        youtubePlayerRef={youtubePlayerRef}
        audioRef={audioRef}
        rainAudioRef={rainAudioRef}
        cafeAudioRef={cafeAudioRef}
        streetAudioRef={streetAudioRef}
        onClose={() => setPanelOpen(false)}
      />

      <TimerPanel
        panelOpen={timerPanelOpen}
        onClose={() => setTimerPanelOpen(false)}
      />

      <ChatWindow 
        panelOpen={chatPanelOpen}
        onClose={() => setChatPanelOpen(false)}
      />

      <div className="absolute bottom-6 right-6 z-30">
        <button
          onClick={() => setChatPanelOpen(!chatPanelOpen)}
          className={`group relative w-14 h-14 backdrop-blur-xl rounded border border-white/20 shadow-2xl transition-all flex items-center justify-center
          ${chatPanelOpen
            ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            : "bg-white/10 hover:bg-white/20"}
        `}
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      </div>
    </main>
  );
}