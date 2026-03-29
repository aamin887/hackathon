import { useState, useEffect } from "react";
import { Users, User, Mic, MicOff, Send } from "lucide-react";
import { motion } from "motion/react";
import { Haptics } from "../../lib/haptics";

export default function CommunityRoom({ onClose }) {
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "Sarah",
      text: "The silence today was really grounding.",
      isMe: false,
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      id: "2",
      user: "David",
      text: "I agree. It helped me clear my head.",
      isMe: false,
      avatar: "https://i.pravatar.cc/150?u=david",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(true);

  const handleJoin = () => {
    Haptics.medium();
    setIsJoining(true);
    setTimeout(() => {
      setIsJoined(true);
      setIsJoining(false);
      Haptics.success();
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    Haptics.light();
    const msg = {
      id: Date.now().toString(),
      user: "You",
      text: newMessage,
      isMe: true,
      avatar: <User />,
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  const toggleMute = () => {
    Haptics.light();
    setIsMuted(!isMuted);
  };

  if (!isJoined) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center mb-6 relative">
          <Users className="w-10 h-10 text-secondary" />
          {isJoining && (
            <motion.div
              layoutId="joining-ring"
              className="absolute inset-0 border-4 border-secondary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        <h4 className="text-2xl font-bold mb-2">Weekly Reflection Group</h4>
        <p className="text-on-surface-variant mb-8 max-w-xs">
          Join 12 others in a guided silence and sharing session. This is a safe
          space for everyone.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={`https://i.pravatar.cc/150?u=${i}`}
              className="w-8 h-8 rounded-full border-2 border-surface shadow-sm"
              alt="User"
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">
            +7
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={isJoining}
          className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-bold text-lg shadow-lg shadow-secondary/20 disabled:opacity-50 transition-all active:scale-95"
        >
          {isJoining ? "Connecting..." : "Join Room"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Room Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-container-highest">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h5 className="font-bold text-sm">Reflection Group</h5>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
              14 Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl transition-colors ${isMuted ? "bg-error-container/10 text-error" : "bg-surface-container text-on-surface"}`}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center py-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
            Session Started 20m ago
          </span>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}
          >
            <User />
            <div
              className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                msg.isMe
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-surface-container text-on-surface rounded-bl-none"
              }`}
            >
              {!msg.isMe && (
                <p className="text-[10px] font-bold mb-1 opacity-70">
                  {msg.user}
                </p>
              )}
              <p>{msg.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-surface-container-highest flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Share a reflection..."
          className="flex-1 bg-surface-container px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
