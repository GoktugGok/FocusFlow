import { Rnd } from "react-rnd";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

function VolumeRow({ label, emoji, colorFrom, colorTo, borderColor, iconColor, muted, volume, onMute, onUnmute, onChange }) {
  return (
    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${colorFrom} ${colorTo} flex items-center justify-center border ${borderColor}`}>
            {muted ? (
              <FaVolumeXmark className={`w-3 h-3 ${iconColor}`} size={16} onClick={onUnmute} />
            ) : (
              <FaVolumeHigh className={`w-3 h-3 ${iconColor}`} size={16} onClick={onMute} />
            )}
          </div>
          {emoji && <span className="text-xl">{emoji}</span>}
          <span className="text-white text-sm">{label}</span>
        </div>
        <span className="text-white/60 text-xs tabular-nums">{volume}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={onChange}
        className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:cursor-pointer
        focus:outline-none"
        style={{ WebkitAppearance: "none", outline: "none", borderRadius: "9999px" }}
      />
    </div>
  );
}

export default function SoundPanel({
  panelOpen,
  isYouTubeVideo,
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
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!panelOpen) return null;

  const content = (
    <div className="flex flex-col h-full">
      {/* Başlık */}
      <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/20">
            <FaVolumeHigh className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-sm font-medium">Sound Mixer</span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1">
        {/* YouTube / Audio */}
        {isYouTubeVideo ? (
          <VolumeRow
            label="YouTube"
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

        <div className="text-white/60 text-xs px-1 mt-1">Ambient Sounds</div>

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

  /* ───── MOBİL: Bottom Sheet ───── */
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
        {/* Sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/20 rounded-t-2xl shadow-2xl text-white"
          style={{ maxHeight: "75vh" }}
        >
          {/* Drag bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>
          <div className="px-5 pb-6 pt-2 overflow-y-auto" style={{ maxHeight: "calc(75vh - 40px)" }}>
            {content}
          </div>
        </div>
      </>
    );
  }

  /* ───── DESKTOP: Rnd Widget ───── */
  return (
    <Rnd
      default={{ x: 120, y: 100, width: 300, height: 450 }}
      bounds="window"
      dragHandleClassName="drag-zone-sound"
      enableResizing={false}
      cancel=".no-drag"
      minHeight={600}
      minWidth={280}
      style={{ zIndex: 40, overflow: "hidden", borderRadius: "1rem" }}
    >
      <div className="relative drag-zone-sound bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
        <div className="drag-zone-sound absolute top-1 right-1 w-6 h-6 bg-white/20 rounded-xl cursor-move flex items-center justify-center">
          ⬍
        </div>
        <div className="no-drag p-5 flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {content}
        </div>
      </div>
    </Rnd>
  );
}
