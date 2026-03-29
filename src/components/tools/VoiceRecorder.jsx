import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Save,
  Loader2,
  Sparkles,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Haptics } from "../../lib/haptics";
import { transcribeAndSummarizeAudio } from "../../services/geminiService";

export default function VoiceRecorder({ onSave }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setResult(null);
      setAudioUrl(null);
      Haptics?.medium?.();

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      Haptics?.light?.();
    }
  };

  const processAudio = async (blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];
        const res = await transcribeAndSummarizeAudio(base64data, "audio/webm");
        setResult(res);

        setIsProcessing(false);
        Haptics?.success?.();
      };
    } catch (error) {
      console.error("Error processing audio:", error);
      setIsProcessing(false);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    const voice = voices.find((v) => v.name.includes("Google UK English"));
    if (voice) utterance.voice = voice;

    speechSynthesis.speak(utterance);
  };

  const pause = () => speechSynthesis.pause();
  const resume = () => speechSynthesis.resume();
  const stop = () => speechSynthesis.cancel();

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // audioRef.current.pause();
        pause();
      } else {
        speak(result?.summary);
      }

      if (isPlaying) {
        stop();
      }
      setIsPlaying(!isPlaying);
      Haptics?.light?.();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    Haptics?.success?.();
    onSave();
  };

  const reset = () => {
    setAudioUrl(null);
    setResult(null);
    setRecordingTime(0);
    Haptics?.medium?.();
  };

  return (
    <div className="flex flex-col items-center py-6 px-4">
      {/* Recording Visualization */}
      <div className="w-full flex flex-col items-center justify-center mb-12">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center relative ${isRecording ? "bg-error-container/20" : "bg-primary-container"}`}
        >
          {isRecording && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-error-container rounded-full"
            />
          )}
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center relative z-10 ${isRecording ? "bg-error text-white" : "bg-primary text-white"}`}
          >
            {isRecording ? (
              <Square className="w-10 h-10 fill-current" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-3xl font-mono font-bold mb-2">
            {formatTime(recordingTime)}
          </p>
          <p className="text-on-surface-variant font-medium">
            {isRecording
              ? "Recording your thoughts..."
              : audioUrl
                ? "Recording complete"
                : "Tap to start recording"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-12">
        {!audioUrl && !isRecording && (
          <button
            onClick={startRecording}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
          >
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-error text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-error/20 hover:scale-105 active:scale-95 transition-transform"
            style={{ color: "red" }}
          >
            Stop Recording
          </button>
        )}

        {audioUrl && !isRecording && (
          <>
            <button
              onClick={togglePlayback}
              className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={reset}
              className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* AI Results */}
      <AnimatePresence>
        {(isProcessing || result) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            {isProcessing ? (
              <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <p className="text-on-surface-variant font-medium">
                  transcribing and summarizing...
                </p>
              </div>
            ) : (
              result && (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <Sparkles className="w-5 h-5" />
                      <h4 className="font-bold text-sm uppercase tracking-widest">
                        Supportive Summary
                      </h4>
                    </div>
                    <p className="text-on-surface leading-relaxed italic">
                      "{result.summary}"
                    </p>
                  </div>

                  <div className="bg-surface-container p-6 rounded-[2rem]">
                    <div className="flex items-center gap-2 text-on-surface-variant mb-3">
                      <FileText className="w-5 h-5" />
                      <h4 className="font-bold text-sm uppercase tracking-widest">
                        Transcription
                      </h4>
                    </div>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {result.transcription}
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Save className="w-5 h-5" />
                    Save Voice Note
                  </button>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        src={audioUrl || ""}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
