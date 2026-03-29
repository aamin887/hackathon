import { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";
import { Haptics } from "../../lib/haptics"; // Keep this if you have your Haptics library

export default function TextEntry({ onSave }) {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim()) {
      Haptics?.success?.();
      if (onSave) onSave(text);
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Textarea */}
      <div className="flex-1 mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling right now? Write it down..."
          className="w-full h-full min-h-[200px] bg-surface-container border-none rounded-[2rem] p-8 font-body text-lg focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-surface"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSave();
            }
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => Haptics?.light?.()}
            className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Add emoji"
          >
            <Smile className="w-6 h-6" />
          </button>
          <button
            onClick={() => Haptics?.light?.()}
            className="p-3 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label="Attach file"
          >
            <Paperclip className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          aria-label="Save entry"
        >
          <Send className="w-5 h-5" />
          Save Entry
        </button>
      </div>
    </div>
  );
}
