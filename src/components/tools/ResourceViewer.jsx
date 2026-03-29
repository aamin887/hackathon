import { useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  BookOpen,
  Video,
  Mic2,
  Clock,
} from "lucide-react";
import { Haptics } from "../../lib/haptics";

export default function ResourceViewer({ resource }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    Haptics?.light?.();
    setIsPlaying(!isPlaying);
  };

  const renderContent = () => {
    const category = resource.category?.toLowerCase();

    if (category === "video") {
      return (
        <div className="space-y-6">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden relative group">
            <img
              src={
                resource.image ||
                `https://picsum.photos/seed/${resource.title}/800/450`
              }
              alt={resource.title}
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl scale-110 group-hover:scale-125 transition-transform">
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current ml-1" />
                )}
              </div>
            </button>
            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    className="h-full bg-primary"
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-white/60 font-mono">
                  <span>04:20</span>
                  <span>12:00</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-bold font-headline leading-tight">
              {resource.title}
            </h4>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm">
              <Video className="w-4 h-4" />
              <span>Video Lesson • {resource.time}</span>
            </div>
          </div>

          <p className="text-on-surface-variant leading-relaxed">
            In this video, we explore practical techniques to stay grounded and
            focused. Learn how to manage your energy and maintain a positive
            outlook throughout the day.
          </p>
        </div>
      );
    }

    if (category === "podcast" || category === "audio") {
      return (
        <div className="flex flex-col items-center text-center space-y-8 py-4">
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.05, 1] : 1,
              rotate: isPlaying ? [0, 2, -2, 0] : 0,
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-64 h-64 rounded-[3rem] bg-surface-container-highest shadow-2xl overflow-hidden relative"
          >
            <img
              src={
                resource.image ||
                `https://picsum.photos/seed/${resource.title}/400/400`
              }
              alt={resource.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          </motion.div>

          <div className="space-y-2">
            <h4 className="text-2xl font-bold font-headline">
              {resource.title}
            </h4>
            <p className="text-primary font-bold text-sm uppercase tracking-widest">
              The Wellness Podcast
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isPlaying ? "65%" : "30%" }}
                className="h-full bg-primary"
              />
            </div>
            <div className="flex justify-between text-xs text-on-surface-variant font-mono">
              <span>08:45</span>
              <span>{resource.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => Haptics?.light?.()}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <SkipBack className="w-8 h-8 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 fill-current" />
              ) : (
                <Play className="w-10 h-10 fill-current ml-1" />
              )}
            </button>

            <button
              onClick={() => Haptics?.light?.()}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <SkipForward className="w-8 h-8 fill-current" />
            </button>
          </div>
        </div>
      );
    }

    // Default: Article
    return (
      <div className="space-y-8">
        <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden">
          <img
            src={
              resource.image ||
              `https://picsum.photos/seed/${resource.title}/800/400`
            }
            alt={resource.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-widest">
              Article
            </span>
            <span className="text-on-surface-variant">•</span>
            <div className="flex items-center gap-1 text-on-surface-variant text-sm">
              <Clock className="w-4 h-4" />
              <span>{resource.time}</span>
            </div>
          </div>
          <h4 className="text-3xl font-bold font-headline leading-tight text-on-surface">
            {resource.title}
          </h4>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface-variant leading-relaxed space-y-6 text-lg">
          <p>
            In today's fast-paced world, finding moments of stillness can feel
            like a luxury. However, research consistently shows that even small
            periods of intentional reflection can significantly improve mental
            clarity and emotional resilience.
          </p>
          <p>
            This article explores three core pillars of mindfulness that you can
            integrate into your daily routine without needing extra time or
            special equipment. From active listening to sensory grounding, these
            tools are designed to meet you exactly where you are.
          </p>
          <p className="font-bold text-on-surface">1. The Power of Presence</p>
          <p>
            Presence isn't about clearing your mind; it's about noticing where
            your mind goes without judgment. When you catch yourself worrying
            about the future, simply label the thought as "planning" and return
            to the physical sensation of your breath.
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-12"
    >
      {renderContent()}
    </motion.div>
  );
}
