import { Rnd } from "react-rnd";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

/* ─── Tek ses satırı bileşeni ─── */
function VolumeRow({ label, emoji, colorFrom, colorTo, borderColor, iconColor, muted, volume, onMute, onUnmute, onChange, iosNoSlider }) {
  return (
    <div className="bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl p-4 border border-white/5 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} flex items-center justify-center border ${borderColor} transition-all active:scale-90 shadow-lg shadow-black/20`}
            onClick={muted ? onUnmute : onMute}
          >
            {muted
              ? <FaVolumeXmark className={`w-3.5 h-3.5 ${iconColor} drop-shadow-[0_0_5px_currentColor]`} />
              : <FaVolumeHigh className={`w-3.5 h-3.5 ${iconColor} drop-shadow-[0_0_5px_currentColor]`} />}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              {emoji && <span className="text-base">{emoji}</span>}
              <span className="text-white font-bold text-xs tracking-wide uppercase opacity-90">{label}</span>
            </div>
            <span className="text-white/30 text-[10px] font-medium leading-none mt-0.5">{muted ? 'Muted' : 'Playing'}</span>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
          <span className="text-white/60 text-[10px] font-black tabular-nums">{volume}%</span>
        </div>
      </div>

      {iosNoSlider ? (
        <div className="flex items-center gap-3 mt-1 px-1">
          <div className="flex-1 h-[1px] bg-white/10" />
          <button
            onClick={muted ? onUnmute : onMute}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${muted
              ? "bg-white/5 border-white/10 text-white/40"
              : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-lg shadow-emerald-500/10"}`}
          >
            {muted ? "Unmute" : "Muted"}
          </button>
        </div>
      ) : (
        <div className="relative group/slider px-1">
          <input
            type="range" min="0" max="100" value={volume}
            onChange={onChange}
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer accent-white appearance-none hover:bg-white/20 transition-colors"
            style={{ borderRadius: "9999px" }}
          />
        </div>
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
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/30 to-sky-500/30 flex items-center justify-center border border-white/20">
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
            colorFrom="from-sky-500/40" colorTo="to-emerald-500/40"
            borderColor="border-sky-400/30" iconColor="text-sky-300"
            muted={youtubeMuted} volume={youtubeVolume}
            onMute={() => handleVolumeChange(youtubePlayerRef, 0, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
            onUnmute={() => handleVolumeChange(youtubePlayerRef, 50, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
            onChange={(e) => setYoutubeVolume(Number(e.target.value))}
          />
        ) : (
          <VolumeRow
            label="Audio"
            colorFrom="from-sky-500/40" colorTo="to-emerald-500/40"
            borderColor="border-sky-400/30" iconColor="text-sky-300"
            muted={audioMuted} volume={audioVolume}
            onMute={() => handleVolumeChange(audioRef, 0, setAudioVolume, setAudioMuted, "audioVolume")}
            onUnmute={() => handleVolumeChange(audioRef, 50, setAudioVolume, setAudioMuted, "audioVolume")}
            onChange={(e) => setAudioVolume(Number(e.target.value))}
          />
        )}

        <div className="text-white/30 text-[10px] uppercase font-bold tracking-widest px-1 pt-4 pb-1">Ambient Sounds</div>

        <VolumeRow
          label="Street" emoji="🚗"
          colorFrom="from-orange-500/40" colorTo="to-amber-500/40"
          borderColor="border-orange-400/30" iconColor="text-orange-300"
          muted={streetMuted} volume={streetVolume}
          onMute={() => handleVolumeChange(streetAudioRef, 0, setStreetVolume, setStreetMuted, "streetVolume")}
          onUnmute={() => handleVolumeChange(streetAudioRef, 50, setStreetVolume, setStreetMuted, "streetVolume")}
          onChange={(e) => handleVolumeChange(streetAudioRef, Number(e.target.value), setStreetVolume, setStreetMuted)}
        />
        <VolumeRow
          label="Rain" emoji="🌧️"
          colorFrom="from-blue-500/40" colorTo="to-cyan-500/40"
          borderColor="border-blue-400/30" iconColor="text-blue-300"
          muted={rainMuted} volume={rainVolume}
          onMute={() => handleVolumeChange(rainAudioRef, 0, setRainVolume, setRainMuted, "rainVolume")}
          onUnmute={() => handleVolumeChange(rainAudioRef, 50, setRainVolume, setRainMuted, "rainVolume")}
          onChange={(e) => handleVolumeChange(rainAudioRef, Number(e.target.value), setRainVolume, setRainMuted)}
        />
        <VolumeRow
          label="Cafe" emoji="☕"
          colorFrom="from-emerald-500/40" colorTo="to-teal-500/40"
          borderColor="border-emerald-400/30" iconColor="text-emerald-300"
          muted={cafeMuted} volume={cafeVolume}
          onMute={() => handleVolumeChange(cafeAudioRef, 0, setCafeVolume, setCafeMuted, "cafeVolume")}
          onUnmute={() => handleVolumeChange(cafeAudioRef, 50, setCafeVolume, setCafeMuted, "cafeVolume")}
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
