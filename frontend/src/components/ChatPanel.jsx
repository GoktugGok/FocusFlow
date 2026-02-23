import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { X } from "lucide-react";

const ChatBox = ({ panelOpen, onClose }) => {
  if (!panelOpen) return null;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [messages, setMessages] = useState([
    { id: 1, username: "Alice", text: "Hey there!", userColor: "from-pink-500 to-rose-500", timestamp: new Date() },
    { id: 2, username: "You", text: "Hi Alice!", userColor: "from-blue-500 to-cyan-500", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping] = useState(false);
  const [typingUser] = useState("Alice");
  const scrollRef = useRef(null);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg = {
      id: Date.now(),
      username: "You",
      text: inputValue,
      userColor: "from-blue-500 to-cyan-500",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  const groupMembers = [
    { name: "Alice", emoji: "🌸", color: "from-pink-500 to-rose-500" },
    { name: "Bob", emoji: "🔥", color: "from-orange-500 to-yellow-500" },
    { name: "Clara", emoji: "🌙", color: "from-violet-500 to-fuchsia-500" },
  ];

  const chatContent = (
    <>
      {/* Header */}
      <div className="py-3 px-4 border-b border-white/20 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center border border-violet-400/30 text-sm">
              👥
            </div>
            <div>
              <h6 className="text-white text-sm m-0">Lofi Study Group</h6>
              <p className="text-white/60 text-xs m-0">{groupMembers.length + 1} members online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {groupMembers.map((member, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${member.color} border border-white/20 flex items-center justify-center text-xs`}
                  title={member.name}
                >
                  {member.emoji}
                </div>
              ))}
            </div>
            {isMobile && (
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center ml-1">
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-2 items-start">
              <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br ${message.userColor} text-xs`}>
                {message.username === "You" ? "YOU" : message.username[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-sm bg-gradient-to-r ${message.userColor} bg-clip-text text-transparent`}>
                    {message.username}
                  </span>
                  <span className="text-white/40 text-xs">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <p className="text-white text-sm break-words m-0">{message.text}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 text-white/60 text-xs rounded-lg">...</div>
              <div className="flex-1">
                <span className="text-white/60 text-xs mb-1 block">{typingUser} is typing...</span>
                <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 inline-block">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/20 flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message the group..."
            className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-400/30 hover:from-violet-500/40 hover:to-fuchsia-500/40 transition-all flex items-center justify-center disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );

  /* ───── MOBİL: Bottom Sheet (tüm ekran) ───── */
  if (isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
        <div
          className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/98 backdrop-blur-xl border-t border-white/20 rounded-t-2xl shadow-2xl text-white flex flex-col"
          style={{ height: "80vh" }}
        >
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>
          {chatContent}
        </div>
      </>
    );
  }

  /* ───── DESKTOP: Rnd Widget ───── */
  return (
    <Rnd
      default={{ x: window.innerWidth - 420, y: 100, width: 380, height: 500 }}
      bounds="window"
      dragHandleClassName="drag-zone-chat"
      style={{ zIndex: 60 }}
      enableResizing={false}
      cancel=".no-drag"
      minHeight={400}
      minWidth={320}
    >
      <div className="relative drag-zone-chat bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
        <div className="drag-zone-chat absolute top-1 right-1 w-6 h-6 bg-white/20 rounded-xl cursor-move flex items-center justify-center">
          ⬍
        </div>
        {chatContent}
      </div>
    </Rnd>
  );
};

export default ChatBox;
