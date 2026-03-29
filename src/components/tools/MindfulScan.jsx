import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { Haptics } from "../../lib/haptics";

const scanPoints = [
  {
    part: "Feet & Toes",
    instruction: "Notice the weight of your feet on the floor. Feel each toe.",
  },
  {
    part: "Ankles & Calves",
    instruction: "Release any tension in your lower legs.",
  },
  {
    part: "Knees & Thighs",
    instruction: "Feel the support of your seat. Let your thighs soften.",
  },
  {
    part: "Hips & Pelvis",
    instruction: "Notice the center of your body. Breathe into this space.",
  },
  {
    part: "Stomach & Lower Back",
    instruction:
      "Let your belly be soft. Feel the rise and fall of your breath.",
  },
  {
    part: "Chest & Upper Back",
    instruction:
      "Notice your heart beating. Let your shoulders drop away from your ears.",
  },
  {
    part: "Hands & Arms",
    instruction:
      "Rest your hands comfortably. Feel the stillness in your fingers.",
  },
  {
    part: "Neck & Throat",
    instruction:
      "Soften your jaw. Let your tongue rest away from the roof of your mouth.",
  },
  {
    part: "Face & Head",
    instruction: "Relax the muscles around your eyes. Smooth your forehead.",
  },
  {
    part: "Whole Body",
    instruction: "Feel your entire body as one. Present, still, and calm.",
  },
];

export default function MindfulScan() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isPlaying || isComplete) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, isComplete]);

  const handleNext = () => {
    if (currentIndex < scanPoints.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      Haptics.medium();
    } else {
      setIsComplete(true);
      setIsPlaying(false);
      Haptics.success();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      Haptics.light();
    }
  };

  const togglePlay = () => {
    Haptics.light();
    setIsPlaying((prev) => !prev);
  };

  const reset = () => {
    Haptics.medium();
    setCurrentIndex(0);
    setProgress(0);
    setIsPlaying(false);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>
        <h4 className="text-2xl font-bold mb-2">Scan Complete</h4>
        <p className="text-on-surface-variant mb-8">
          You've successfully checked in with your entire body.
        </p>
        <button
          onClick={reset}
          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold"
          aria-label="Start scan again"
        >
          Start Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 px-4">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface-container-highest rounded-full mb-12 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentIndex + progress / 100) / scanPoints.length) * 100}%`,
          }}
        />
      </div>

      <div className="text-center mb-12 min-h-[200px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Step {currentIndex + 1} of {scanPoints.length}
            </span>
            <h4 className="text-3xl font-bold font-headline">
              {scanPoints[currentIndex].part}
            </h4>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xs mx-auto">
              {scanPoints[currentIndex].instruction}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-full bg-surface-container text-on-surface disabled:opacity-30"
          aria-label="Previous step"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={togglePlay}
          className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
          aria-label={isPlaying ? "Pause scan" : "Play scan"}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-4 rounded-full bg-surface-container text-on-surface"
          aria-label="Next step"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="mt-12 flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
          aria-label="Reset scan"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
