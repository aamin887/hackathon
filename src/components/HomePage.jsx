import { useState } from "react";
import {
  Mic,
  Edit3,
  Image as ImageIcon,
  Play,
  Bookmark,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";

import Modal from "./ui/Modal";
import BreathingExercise from "./tools/BreathingExercise";
import TextEntry from "./tools/TextEntry";
import ResourceViewer from "./tools/ResourceViewer";
import CommunityRoom from "./tools/CommunityRoom";
import VoiceRecorder from "./tools/VoiceRecorder";

import { Haptics } from "../lib/haptics";

export default function HomePage() {
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isTextEntryOpen, setIsTextEntryOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const handleOpen = (setter) => {
    Haptics.light();
    setter(true);
  };

  const handleOpenResource = (res) => {
    Haptics.light();
    setSelectedResource(res);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      {/* Welcome */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-2">
          How are you feeling right now?
        </h2>
        <p className="text-gray-500">
          Take a breath. Choose how to express yourself.
        </p>
      </section>

      {/* Input */}
      <section className="grid md:grid-cols-2 gap-4 mb-12">
        {/* Voice */}
        <button
          onClick={() => handleOpen(setIsVoiceOpen)}
          className="md:col-span-2 bg-blue-100 p-6 rounded-xl text-left"
        >
          <div className="flex justify-between mb-4">
            <Mic />
            <ArrowUpRight />
          </div>
          <h3 className="font-bold text-xl">Talk to us</h3>
          <p className="text-sm text-gray-600">Voice input</p>
        </button>

        {/* Text */}
        <button
          onClick={() => handleOpen(setIsTextEntryOpen)}
          className="bg-gray-100 p-6 rounded-xl text-left"
        >
          <Edit3 />
          <h3 className="font-bold mt-4">Write it down</h3>
        </button>

        {/* Image */}
        <button className="bg-gray-100 p-6 rounded-xl text-left">
          <ImageIcon />
          <h3 className="font-bold mt-4">Share a picture</h3>
        </button>
      </section>

      {/* Support */}
      <section className="space-y-4">
        {/* Breathing */}
        <div className="bg-gray-100 p-4 rounded-xl flex items-center gap-4">
          <img
            src="https://picsum.photos/seed/forest/100"
            className="w-14 h-14 rounded-lg"
          />

          <div className="flex-1">
            <h4 className="font-bold">4-7-8 Breathing</h4>
            <p className="text-sm text-gray-500">3 min calm</p>
          </div>

          <button onClick={() => handleOpen(setIsBreathingOpen)}>
            <Play />
          </button>
        </div>

        {/* Article */}
        <div
          onClick={() =>
            handleOpenResource({
              title: "Understanding Cognitive Fog",
              category: "Article",
              time: "6 min read",
            })
          }
          className="bg-gray-100 p-4 rounded-xl flex items-center gap-4 cursor-pointer"
        >
          <img
            src="https://picsum.photos/seed/mind/100"
            className="w-14 h-14 rounded-lg"
          />

          <div className="flex-1">
            <h4 className="font-bold">Cognitive Fog</h4>
            <p className="text-sm text-gray-500">Article</p>
          </div>

          <Bookmark />
        </div>

        {/* Community */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h4 className="font-bold mb-2">Weekly Reflection</h4>
          <button
            onClick={() => handleOpen(setIsCommunityOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Join
          </button>
        </div>
      </section>

      {/* Modals */}
      <Modal isOpen={isBreathingOpen} onClose={() => setIsBreathingOpen(false)}>
        <BreathingExercise type="4-7-8" />
      </Modal>

      <Modal isOpen={isTextEntryOpen} onClose={() => setIsTextEntryOpen(false)}>
        <TextEntry onSave={() => setIsTextEntryOpen(false)} />
      </Modal>

      <Modal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)}>
        <VoiceRecorder onSave={() => setIsVoiceOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
      >
        {selectedResource && <ResourceViewer resource={selectedResource} />}
      </Modal>

      <Modal isOpen={isCommunityOpen} onClose={() => setIsCommunityOpen(false)}>
        <CommunityRoom />
      </Modal>
    </motion.main>
  );
}
