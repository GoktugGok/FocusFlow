import { Rnd } from "react-rnd";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/* ─── Tek ses satırı bileşeni ─── */
function VolumeRow({ label, emoji, colorFrom, colorTo, borderColor, iconColor, muted, volume, onMute, onUnmute, onChange, iosNoSlider }) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button
            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorFrom} ${colorTo} flex items-center justify-center border ${borderColor} transition-all`}
            onClick={muted ? onUnmute : onMute}
          >
            {muted
              ? <FaVolumeXmark className={`w-3 h-3 ${iconColor}`} />
              : <FaVolumeHigh className={`w-3 h-3 ${iconColor}`} />}
          </button>
          {emoji && <span className="text-lg">{emoji}</span>}
          <span className="text-white text-sm">{label}</span>
        </div>
        <span className="text-white/50 text-xs tabular-nums">{volume}%</span>
      </div>

      {iosNoSlider ? (
        /* iOS'ta YouTube ses slider'ı çalışmaz — toggle göster */
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white/40 text-xs">iOS'ta sistem sesi kullan</span>
          <button
            onClick={muted ? onUnmute : onMute}
            className={`ml-auto px-3 py-1 rounded-lg text-xs border transition-all ${muted
              ? "bg-white/10 border-white/20 text-white/60"
              : "bg-purple-500/30 border-purple-400/40 text-purple-200"}`}
          >
            {muted ? "🔇 Sessiz" : "🔊 Açık"}
          </button>
        </div>
      ) : (
        <input
          type="range" min="0" max="100" value={volume}
          onChange={onChange}
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer accent-purple-400
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-md
            focus:outline-none"
          style={{ WebkitAppearance: "none", outline: "none", borderRadius: "9999px" }}
        />
      )}
    </div>
  );
}

export default function SoundPanel({
  panelOpen,
  isYouTubeVideo,
  isIOS,
  youtubeMuted, setYoutubeMuted, youtubeVolume, setYoutubeVolume,
  audioMuted, setAudioMuted, audioVolume, setAudioVolume,
  rainMuted, setRainMuted, rainVolume, setRainVolume,
  cafeMuted, setCafeMuted, cafeVolume, setCafeVolume,
  streetMuted, setStreetMuted, streetVolume, setStreetVolume,
  handleVolumeChange,
  youtubePlayerRef, audioRef, rainAudioRef, cafeAudioRef, streetAudioRef,
  onClose,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!panelOpen) return null;

  const content = (
    <div className="flex flex-col h-full">
      {/* Başlık */}
      <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-white/20">
            <FaVolumeHigh className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-medium text-sm">Sound Mixer</span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-0.5">
        {/* YouTube / Audio */}
        {isYouTubeVideo ? (
          <VolumeRow
            label="YouTube" iosNoSlider={isIOS}
            colorFrom="from-purple-500/30" colorTo="to-pink-500/30"
            borderColor="border-purple-400/30" iconColor="text-purple-300"
            muted={youtubeMuted} volume={youtubeVolume}
            onMute={() => handleVolumeChange(youtubePlayerRef, 0, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
            onUnmute={() => handleVolumeChange(youtubePlayerRef, 10, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
            onChange={(e) => setYoutubeVolume(Number(e.target.value))}
          />
        ) : (
          <VolumeRow
            label="Audio"
            colorFrom="from-purple-500/30" colorTo="to-pink-500/30"
            borderColor="border-purple-400/30" iconColor="text-purple-300"
            muted={audioMuted} volume={audioVolume}
            onMute={() => handleVolumeChange(audioRef, 0, setAudioVolume, setAudioMuted, "audioVolume")}
            onUnmute={() => handleVolumeChange(audioRef, 10, setAudioVolume, setAudioMuted, "audioVolume")}
            onChange={(e) => setAudioVolume(Number(e.target.value))}
          />
        )}

        <div className="text-white/40 text-xs px-1 pt-1">Ambient Sounds</div>

        <VolumeRow
          label="Street" emoji="🚗"
          colorFrom="from-orange-500/30" colorTo="to-red-500/30"
          borderColor="border-orange-400/30" iconColor="text-orange-300"
          muted={streetMuted} volume={streetVolume}
          onMute={() => handleVolumeChange(streetAudioRef, 0, setStreetVolume, setStreetMuted, "streetVolume")}
          onUnmute={() => handleVolumeChange(streetAudioRef, 10, setStreetVolume, setStreetMuted, "streetVolume")}
          onChange={(e) => handleVolumeChange(streetAudioRef, Number(e.target.value), setStreetVolume, setStreetMuted)}
        />
        <VolumeRow
          label="Rain" emoji="🌧️"
          colorFrom="from-blue-500/30" colorTo="to-cyan-500/30"
          borderColor="border-blue-400/30" iconColor="text-blue-300"
          muted={rainMuted} volume={rainVolume}
          onMute={() => handleVolumeChange(rainAudioRef, 0, setRainVolume, setRainMuted, "rainVolume")}
          onUnmute={() => handleVolumeChange(rainAudioRef, 10, setRainVolume, setRainMuted, "rainVolume")}
          onChange={(e) => handleVolumeChange(rainAudioRef, Number(e.target.value), setRainVolume, setRainMuted)}
        />
        <VolumeRow
          label="Cafe" emoji="☕"
          colorFrom="from-amber-500/30" colorTo="to-yellow-500/30"
          borderColor="border-amber-400/30" iconColor="text-amber-300"
          muted={cafeMuted} volume={cafeVolume}
          onMute={() => handleVolumeChange(cafeAudioRef, 0, setCafeVolume, setCafeMuted, "cafeVolume")}
          onUnmute={() => handleVolumeChange(cafeAudioRef, 10, setCafeVolume, setCafeMuted, "cafeVolume")}
          onChange={(e) => handleVolumeChange(cafeAudioRef, Number(e.target.value), setCafeVolume, setCafeMuted)}
        />
      </div>
    </div>
  );

  /* ── MOBİL Bottom Sheet ── */
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-2xl border-t border-white/15 rounded-t-3xl shadow-2xl text-white"
          style={{
            maxHeight: "75vh",
            paddingBottom: "env(safe-area-inset-bottom, 16px)"
          }}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/25 rounded-full" />
          </div>
          <div className="px-5 pb-4 pt-1 overflow-y-auto" style={{ maxHeight: "calc(75vh - 48px)" }}>
            {content}
          </div>
        </div>
      </>
    );
  }

  /* ── DESKTOP Rnd Widget ── */
  return (
    <Rnd
      default={{ x: 120, y: 100, width: 300, height: 470 }}
      bounds="window"
      dragHandleClassName="drag-zone-sound"
      enableResizing={false}
      cancel=".no-drag"
      minHeight={470}
      minWidth={280}
      style={{ zIndex: 40, overflow: "hidden", borderRadius: "1rem" }}
    >
      <div className="relative drag-zone-sound bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
        <div className="drag-zone-sound absolute top-2 right-2 w-6 h-6 bg-white/15 rounded-lg cursor-move flex items-center justify-center text-white/60 text-xs hover:bg-white/25 transition-all">
          ⬍
        </div>
        <div className="no-drag p-5 flex flex-col gap-3 h-full overflow-y-auto">
          {content}
        </div>
      </div>
    </Rnd>
  );
}
