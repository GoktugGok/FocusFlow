import React, { useState, useRef } from "react";
import { Rnd } from "react-rnd";

const ChatBox = ({ panelOpen, onClose }) => {
  if (!panelOpen) return null;
  const [messages, setMessages] = useState([
    { id: 1, username: "Alice", text: "Hey there!", userColor: "from-pink-500 to-rose-500", timestamp: new Date() },
    { id: 2, username: "You", text: "Hi Alice!", userColor: "from-blue-500 to-cyan-500", timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("Alice");
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
      <div className="relative drag-zone-chat bg-white/10 backdrop-blur-xl rounded-2xl border-1 border-white/20 shadow-2xl text-white w-full h-full flex flex-col">
        
        {/* Drag Handle */}
        <div className="drag-zone-chat absolute top-1 right-1 w-6 h-6 bg-white/20 rounded-xl cursor-move flex items-center justify-center">
          ⬍
        </div>

        {/* Header */}
        <div className="no-drag py-3 px-4 border-b border-white/20">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 flex items-center justify-center border-1 border-violet-400/30 text-sm">
                👥
              </div>
              <div>
                <h6 className="text-white text-sm m-0">Lofi Study Group</h6>
                <p className="text-white/60 text-xs m-0">{groupMembers.length + 1} members online</p>
              </div>
            </div>

            {/* Avatars */}
            <div className="flex -space-x-2">
              {groupMembers.map((member, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${member.color} border-1 border-white/20 flex items-center justify-center text-xs`}
                  title={member.name}
                >
                  {member.emoji}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 no-drag" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-2 items-start ">
                {/* Avatar fallback */}
                <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br ${message.userColor} text-xs`}>
                  {message.username === "You" ? "YOU" : message.username[0].toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-sm bg-gradient-to-r ${message.userColor} bg-clip-text text-transparent`}>
                      {message.username}
                    </span>
                    <span className="text-white/40 text-xs ">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="bg-white/5 border-1 rounded-bottom border-white/10  px-2 pt-1 p-0">
                    <p className="text-white text-sm  text-break">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-start">
                <div className="w-8 h-8 flex items-center justify-center bg-white/10 text-white/60 text-xs rounded-lg">
                  ...
                </div>
                <div className="flex-1">
                  <span className="text-white/60 text-xs mb-1 block">{typingUser} is typing...</span>
                  <div className="bg-white/5 border-1 rounded-bottom border-white/10  px-3 py-2 inline-block">
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
        <div className="no-drag p-4 border-t border-white/20">
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Message the group..."
              className="flex-1 bg-white/5 border-1 border-white/20 rounded-lg px-3 py-2 text-white placeholder:text-white/40 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border-1 border-violet-400/30 hover:from-violet-500/40 hover:to-fuchsia-500/40 transition-all flex items-center justify-center disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </Rnd>
    
  );
};

export default ChatBox;
