import { useState } from "react";
import {
  Heart,
  Wind,
  Brain,
  Smile,
  Frown,
  Meh,
  CloudRain,
  Sun,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Modal from "./ui/Modal";
import BreathingExercise from "./tools/BreathingExercise";
import MindfulScan from "./tools/MindfulScan";

import { Haptics } from "../lib/haptics";
import { getMoodInsight } from "../services/geminiService";

export default function CopingPage() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [insight, setInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const moods = [
    {
      icon: <Smile className="w-6 h-6" />,
      label: "Great",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <Sun className="w-6 h-6" />,
      label: "Good",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: <Meh className="w-6 h-6" />,
      label: "Okay",
      color: "bg-gray-100 text-gray-700",
    },
    {
      icon: <Frown className="w-6 h-6" />,
      label: "Bad",
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: <CloudRain className="w-6 h-6" />,
      label: "Awful",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  const handleMoodSelect = async (index) => {
    Haptics.light();
    setSelectedMood(index);
    setInsight(null);
    setIsLoadingInsight(true);

    const moodLabel = moods[index].label;

    try {
      const message = await getMoodInsight(moodLabel);
      console.log(message);

      setInsight(message);
    } catch (err) {
      console.log(err);

      setInsight("You're doing your best. It's okay to feel this way.");
    }

    setIsLoadingInsight(false);
  };

  const handleToolSelect = (tool) => {
    Haptics.light();
    setActiveTool(tool);
  };

  const tools = [
    {
      title: "Box Breathing",
      description: "Equalize your breath to calm the nervous system.",
      icon: <Wind className="w-6 h-6" />,
      duration: "4 min",
      color: "bg-blue-100 text-blue-700",
      type: "box",
    },
    {
      title: "4-7-8 Breathing",
      description: "A powerful technique for deep relaxation.",
      icon: <Wind className="w-6 h-6" />,
      duration: "5 min",
      color: "bg-purple-100 text-purple-700",
      type: "4-7-8",
    },
    {
      title: "Mindful Scan",
      description: "Observe sensations in your body without judgment.",
      icon: <Brain className="w-6 h-6" />,
      duration: "10 min",
      color: "bg-pink-100 text-pink-700",
      type: "scan",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-blue-500" />
          <h2 className="text-3xl font-bold">Coping Space</h2>
        </div>
        <p className="text-gray-600">
          Tools to help you navigate difficult moments.
        </p>
      </section>

      {/* Mood Check-in */}
      <section className="mb-8">
        <h3 className="text-sm font-bold uppercase mb-4">
          Quick Mood Check-in
        </h3>

        <div className="flex justify-between gap-2">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(index)}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl ${
                selectedMood === index
                  ? `${mood.color} border-2 border-blue-500`
                  : "bg-gray-100"
              }`}
            >
              {mood.icon}
              <span className="text-xs font-bold">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* AI Insight */}
      <AnimatePresence>
        {(isLoadingInsight || insight) && (
          <motion.div
            className="mb-8 p-4 bg-blue-50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isLoadingInsight ? (
              <p>Generating insight...</p>
            ) : (
              <p className="italic">"{insight}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tools */}
      <section className="space-y-4 mb-10">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={() => handleToolSelect(tool)}
            className="w-full bg-white p-5 rounded-xl shadow flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${tool.color}`}>{tool.icon}</div>

            <div className="flex-1 text-left">
              <h4 className="font-bold">{tool.title}</h4>
              <p className="text-sm text-gray-500">{tool.description}</p>
            </div>

            <ChevronRight />
          </button>
        ))}
      </section>

      {/* Emergency */}
      <div className="bg-red-100 p-6 rounded-xl">
        <h4 className="font-bold mb-2">Need immediate help?</h4>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Get Support
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!activeTool}
        onClose={() => setActiveTool(null)}
        title={activeTool?.title || ""}
      >
        {activeTool?.type === "scan" ? (
          <MindfulScan />
        ) : activeTool ? (
          <BreathingExercise type={activeTool.type} />
        ) : null}
      </Modal>
    </motion.main>
  );
}
