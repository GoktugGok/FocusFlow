import { Rnd } from "react-rnd";
import { use, useState, useRef, useEffect, Input } from "react";
import { IoSettingsSharp  } from "react-icons/io5";
export default function TimerPanel({ panelOpen, onClose }) {
  if (!panelOpen) return null;

    const [mode, setMode] = useState(null);
    const [time, setTime] = useState(25);
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [hasCounted, setHasCounted] = useState(false);
    const [shouldAutoStart, setShouldAutoStart] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [pomodoroTime, setPomodoroTime] = useState(25);
    const [shortBreakTime, setShortBreakTime] = useState(10);
    const [longBreakTime, setLongBreakTime] = useState(15);

    useEffect(() => {
      handleModeChange("pomodoro");
    }, []);
    useEffect(() => {
      if (mode === "pomodoro") {
        setTime(pomodoroTime);
        setSecondsLeft(pomodoroTime * 60);
      }
    }, [pomodoroTime, mode]);

    useEffect(() => {
      if (mode === "short") {
        setTime(shortBreakTime);
        setSecondsLeft(shortBreakTime * 60);
      }
    }, [shortBreakTime, mode]);

    useEffect(() => {
      if (mode === "long") {
        setTime(longBreakTime);
        setSecondsLeft(longBreakTime * 60);
      }
    }, [longBreakTime, mode]);

    useEffect(() => {
      if(shouldAutoStart){
        setShouldAutoStart(false);
        toggleTimer();
      }
    }, [mode]);

    const handleModeChange = (selectedMode) => {
      setMode(selectedMode);
      let newTime = 1;
      if(selectedMode === "pomodoro") newTime = pomodoroTime;
      else if(selectedMode === "short") newTime = shortBreakTime;
      else if(selectedMode === "long") newTime = longBreakTime;
      setTime(newTime);
      setSecondsLeft(newTime * 60);
      setIsRunning(false);
      clearInterval(timerRef.current);
      setHasCounted(false);
    };
    const toggleTimer = () => {
      console.log(mode)
      if(isRunning){
        clearInterval(timerRef.current);
        setIsRunning(false);
      }else{
        clearInterval(timerRef.current);
        setIsRunning(true);
        let hasCounted = false;

        timerRef.current = setInterval(() => {
          setSecondsLeft((prev) =>{
            if(prev <= 1){
              clearInterval(timerRef.current);
              setIsRunning(false);
              if(mode === "pomodoro" && completedSessions == 3){
                handleModeChange("long");
                setShouldAutoStart(true);
              }
              if(mode === "long"){
                hasCounted = false;
                setCompletedSessions(0);
                handleModeChange("pomodoro");
                setShouldAutoStart(true);
              }
              if(mode === "pomodoro" && !hasCounted){
                setCompletedSessions((prevSessions) => Math.min(prevSessions + 1, 4));
                hasCounted = true;
                handleModeChange("short");
                setShouldAutoStart(true);
              }
              if(mode === "short"){
                hasCounted = false;
                handleModeChange("pomodoro");
                setShouldAutoStart(true);
              }
              
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    const reset = () => {
      handleModeChange(mode); 
    }
    useEffect(() =>{
      return () => clearInterval(timerRef.current);
    }, []);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    
  return (
    <Rnd
        default={{ x: 450, y: 100, width: 350, height: "auto" }}
        bounds="window"
        dragHandleClassName="drag-zone"
        style={{ zIndex: 50 }}
        enableResizing={false}
        cancel=".no-drag"
      >
        <div className="relative drag-zone bg-white/10 backdrop-blur-xl rounded-2xl border-1 border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
          <button onClick={() => setSettingsOpen(!settingsOpen)} className="no-drag absolute top-1  left-1 w-6 h-6 bg-white/20 rounded-5 hover:bg-white/30 transition-all flex items-center justify-center z-10">
            <IoSettingsSharp className="w-3.5 h-3.5 text-white"/>
          </button>
          <div className="drag-zone absolute top-1 right-1 w-6 h-6 bg-white/20 rounded-xl cursor-move flex items-center justify-center">
            ⬍
          </div>
          <div 
            className={`no-drag overflow-hidden transition-all duration-300 ${
              settingsOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 border-b border-white/20 space-y-3 mt-2">
              <div className="text-white/80 text-xs mb-2">Timer Settings (minutes)</div>
              
              <div className="flex items-center gap-3">
                <label className="text-white text-xs w-24">Pomodoro:</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroTime === "" ? "" : pomodoroTime}
                  onChange={(e) => setPomodoroTime(Number(e.target.value))}
                  className="h-8 w-100 rounded-3 bg-white/10 border-white/20 text-white p-2 focus:border-white focus:ring-2 focus:ring-white/40 outline-none"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-white text-xs w-24">Short Break:</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={shortBreakTime}
                  onChange={(e) => setShortBreakTime(Number(e.target.value))}
                  className="h-8 w-100 rounded-3 bg-white/10 border-white/20 text-white p-2 focus:border-white focus:ring-2 focus:ring-white/40 outline-none"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-white text-xs w-24">Long Break:</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakTime}
                  onChange={(e) => setLongBreakTime(Number(e.target.value))}
                  className="h-8 w-100 rounded-3 bg-white/10 border-white/20 text-white fs-6 p-2 focus:border-white focus:ring-2 focus:ring-white/40 outline-none"
                />
              </div>
            </div>
          </div>

          {/* İçerik */}
          <div className="no-drag p-4 flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full px-10 border-b border-white/20 pb-3">
              <h1 className="timer-display">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </h1>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`w-2 h-4 rounded-full transition-all ${num <= completedSessions ? "bg-gradient-to-b from-yellow-400 to-yellow-500" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTimer}
                className="timer-btn px-5 py-2 border border-white/30 rounded-lg text-white"
              >
                {isRunning ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="reset-btn w-9 h-9 flex items-center justify-center border border-white/30 rounded-lg hover:bg-white/10 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-6 w-full items-center border-t border-white/20 pt-4 mb-0">
              <div className="flex flex-col items-center w-full">
                <div className="flex gap-4 w-full justify-center">
                  <button
                    onClick={() => handleModeChange("pomodoro")}
                    className={`mode-btn ${mode === "pomodoro" ? "mode-btn-active mode-pomodoro" : "mode-btn-inactive"}`}
                  >
                    Pomodoro
                  </button>
                  <button
                    onClick={() => handleModeChange("short")}
                    className={`mode-btn ${mode === "short" ? "mode-btn-active mode-short" : "mode-btn-inactive"}`}
                  >
                    Short Break
                  </button>
                  <button
                    onClick={() => handleModeChange("long")}
                    className={`mode-btn ${mode === "long" ? "mode-btn-active mode-long" : "mode-btn-inactive"}`}
                  >
                    Long Break
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </Rnd>
  );
}
