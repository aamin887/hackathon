import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Haptics } from "../../lib/haptics";

export default function BreathingExercise(props) {
  const { type, onComplete } = props;

  const [phase, setPhase] = useState("In");
  const [timeLeft, setTimeLeft] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);

  const config = {
    "4-7-8": { in: 4, hold: 7, out: 8, holdOut: 0 },
    box: { in: 4, hold: 4, out: 4, holdOut: 4 },
  };

  // Map the phase sequence per type
  const phaseSequence =
    type === "4-7-8"
      ? ["In", "Hold", "Out"]
      : ["In", "Hold", "Out", "Hold Out"];

  useEffect(() => {
    if (!isActive) return;

    let remainingTime = timeLeft;
    const interval = setInterval(() => {
      remainingTime -= 1;
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        // Move to next phase
        const currentIndex = phaseSequence.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phaseSequence.length;
        const nextPhase = phaseSequence[nextIndex];

        setPhase(nextPhase);
        setTimeLeft(config[type][nextPhase.toLowerCase()]);

        Haptics.medium();

        if (nextIndex === 0) {
          setCycles((c) => c + 1);
          if (onComplete) onComplete();
          Haptics.success();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, type]);

  const reset = () => {
    Haptics.light();
    setIsActive(false);
    setPhase("In");
    setTimeLeft(config[type].in);
    setCycles(0);
  };

  const toggleActive = () => {
    Haptics.light();
    setIsActive(!isActive);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Animated Circle */}
        <motion.div
          animate={{
            scale: phase === "In" || phase === "Hold" ? 1.5 : 1,
            opacity: phase === "In" || phase === "Hold" ? 0.8 : 0.4,
          }}
          transition={{ duration: timeLeft, ease: "linear" }}
          className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: phase === "In" || phase === "Hold" ? 1.2 : 0.8,
          }}
          transition={{ duration: timeLeft, ease: "linear" }}
          className="w-48 h-48 border-4 border-primary rounded-full flex flex-col items-center justify-center bg-surface shadow-xl z-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-3xl font-bold font-headline text-primary mb-1 uppercase tracking-widest">
                {phase}
              </p>
              <p className="text-5xl font-bold font-headline text-on-surface">
                {timeLeft}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="text-center mb-12">
        <p className="text-on-surface-variant font-label uppercase tracking-widest text-xs mb-2">
          Cycles Completed
        </p>
        <p className="text-2xl font-bold font-headline">{cycles}</p>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={reset}
          className="p-4 rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={toggleActive}
          className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>
        <div className="w-14" />
      </div>
    </div>
  );
}
