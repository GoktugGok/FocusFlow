import { Rnd } from "react-rnd";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";
export default function SoundPanel({
  panelOpen,
  isYouTubeVideo,
  youtubeMuted,
  setYoutubeMuted,
  youtubeVolume,
  setYoutubeVolume,
  audioMuted,
  setAudioMuted,
  audioVolume,
  setAudioVolume,
  rainMuted,
  setRainMuted,
  rainVolume,
  setRainVolume,
  cafeMuted,
  setCafeMuted,
  cafeVolume,
  setCafeVolume,
  streetMuted,
  setStreetMuted,
  streetVolume,
  setStreetVolume,
  handleVolumeChange,
  toggleMute,
  youtubePlayerRef,
  audioRef,
  rainAudioRef,
  cafeAudioRef,
  streetAudioRef,
}) {
  if (!panelOpen) return null;

  return (
    <>
    <Rnd
      default={{ x: 120, y: 100, width: 300, height: 450 }}
      bounds="window"
      dragHandleClassName="drag-zone-sound"
      enableResizing={false}
      cancel=".no-drag"
      minHeight={600}
      minWidth={280}
      style={{
        zIndex: 40,
        overflow: "hidden", // 🔥 scroll çubuğunu gizler
        borderRadius: "1rem", // köşeler taşmasın diye
      }}
    >
  <div className="relative drag-zone-sound bg-white/10 backdrop-blur-xl rounded-2xl border-1 border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
      {/* Drag handle */}
        <div className="drag-zone-sound absolute top-1 right-1 w-6 h-6 bg-white/20 rounded-xl cursor-move flex items-center justify-center">
          ⬍
      </div>

    {/* İçerik */}
    <div className="no-drag p-5 flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {/* Başlık */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/20">
          <FaVolumeHigh className="w-4 h-4 text-white" />
        </div>
        <span className="text-white text-sm">
          Sound Mixer
        </span>
      </div>

      {/* YouTube veya Audio Volume */}
      {isYouTubeVideo ? (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-400/30">
                {youtubeMuted ? (
                <FaVolumeXmark
                  className="w-3 h-3 text-purple-300"
                  size={16}
                  onClick={() => handleVolumeChange(youtubePlayerRef, 10, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
                />
              ) : (
                <FaVolumeHigh
                  className="w-3 h-3 text-purple-300"
                  size={16}
                  onClick={() => handleVolumeChange(youtubePlayerRef, 0, setYoutubeVolume, setYoutubeMuted, "youtubeVolume")}
                />
              )}
              
              </div>
              <span className="text-white text-sm">
                YouTube
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs tabular-nums">
                {youtubeVolume}%
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={youtubeVolume}
            onChange={(e) => setYoutubeVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            focus:outline-none"
            style={{
              WebkitAppearance: "none",
              outline: "none",
              borderRadius: "9999px",
            }}
          />
        </div>
      ) : (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-400/30">
                {audioMuted ? (
                <FaVolumeXmark
                  className="w-3 h-3 text-purple-300"
                  size={16}
                  onClick={() => handleVolumeChange(audioRef, 10, setAudioVolume, setAudioMuted, "audioVolume")}
                />
              ) : (
                <FaVolumeHigh
                  className="w-3 h-3 text-purple-300"
                  size={16}
                  onClick={() => handleVolumeChange(audioRef, 0, setAudioVolume, setAudioMuted, "audioVolume")}
                />
              )}
              </div>
              <span className="text-white text-sm">
                Audio
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs tabular-nums">
                {audioVolume}%
              </span>
              
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={audioVolume}
            onChange={(e) => setAudioVolume(Number(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            focus:outline-none"
            style={{
              WebkitAppearance: "none",
              outline: "none",
              borderRadius: "9999px",
            }}
          />
        </div>
      )}

      {/* Ambiance Section */}
      <div className="space-y-3">
        <div className="text-white/60 text-xs px-1">
          Ambient Sounds
        </div>

        {/* Street */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500/30 to-red-500/30 flex items-center justify-center border border-orange-400/30">
                {streetMuted ? (
                <FaVolumeXmark 
                  className="w-3 h-3 text-orange-300"
                  size={16}
                  onClick={() => handleVolumeChange(streetAudioRef, 10, setStreetVolume, setStreetMuted, "streetVolume")}
                />
              ) : (
                <FaVolumeHigh
                  className="w-3 h-3 text-orange-300"
                  size={16}
                  onClick={() => handleVolumeChange(streetAudioRef, 0, setStreetVolume, setStreetMuted, "streetVolume")}
                />
              )}
              </div>
              <span className="text-xl">🚗</span>
              <span className="text-white text-sm">
                Street
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs tabular-nums">
                {streetVolume}%
              </span>
              
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={streetVolume}
            onChange={(e) => handleVolumeChange(streetAudioRef, Number(e.target.value), setStreetVolume, setStreetMuted)}
            className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            focus:outline-none"
            style={{
              WebkitAppearance: "none",
              outline: "none",
              borderRadius: "9999px",
            }}
          />
        </div>

        {/* Rain */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center border border-blue-400/30">
                {rainMuted ? (
                <FaVolumeXmark 
                  className="w-3 h-3 text-blue-300"
                  size={16}
                  onClick={() => handleVolumeChange(rainAudioRef, 10, setRainVolume, setRainMuted, "rainVolume")}
                />
              ) : (
                <FaVolumeHigh
                  className="w-3 h-3 text-blue-300"
                  size={16}
                  onClick={() => handleVolumeChange(rainAudioRef, 0, setRainVolume, setRainMuted, "rainVolume")}
                />
              )}
              </div>
              <span className="text-xl">🌧️</span>
              <span className="text-white text-sm">
                Rain
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs tabular-nums">
                {rainVolume}%
              </span>
              
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={rainVolume}
            onChange={(e) => handleVolumeChange(rainAudioRef, Number(e.target.value), setRainVolume, setRainMuted)}
            className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            focus:outline-none"
            style={{
              WebkitAppearance: "none",
              outline: "none",
              borderRadius: "9999px",
            }}
          />
        </div>

        {/* Cafe */}
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500/30 to-yellow-500/30 flex items-center justify-center border border-amber-400/30">
                {cafeMuted ? (
                <FaVolumeXmark 
                  className="w-3 h-3 text-amber-300"
                  size={16}
                  onClick={() => handleVolumeChange(cafeAudioRef, 10, setCafeVolume, setCafeMuted, "cafeVolume")}
                />
              ) : (
                <FaVolumeHigh
                  className="w-3 h-3 text-amber-300"
                  size={16}
                  onClick={() => handleVolumeChange(cafeAudioRef, 0, setCafeVolume, setCafeMuted, "cafeVolume")}
                />
              )}
              </div>
              <span className="text-xl">☕</span>
              <span className="text-white text-sm">
                Cafe
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs tabular-nums">
                {cafeVolume}%
              </span>
              
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={cafeVolume}
            onChange={(e) => handleVolumeChange(cafeAudioRef, Number(e.target.value), setCafeVolume, setCafeMuted)}
            className="w-full h-2 bg-gray-300 rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-gray-700 [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            focus:outline-none"
            style={{
              WebkitAppearance: "none",
              outline: "none",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>
    </div>
  </div>
</Rnd>
    
    </>
  );
}
