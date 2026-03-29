import { useState } from "react";
import {
  Search,
  BookOpen,
  Video,
  Mic2,
  Dumbbell,
  ChevronRight,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

import Modal from "./ui/Modal";
import ResourceViewer from "./tools/ResourceViewer";
import { Haptics } from "../lib/haptics";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);

  const handleResourceClick = (res) => {
    Haptics.light();
    setSelectedResource(res);
  };

  const categories = [
    { name: "Articles", icon: <BookOpen className="w-5 h-5" />, count: "24" },
    { name: "Videos", icon: <Video className="w-5 h-5" />, count: "12" },
    { name: "Podcasts", icon: <Mic2 className="w-5 h-5" />, count: "8" },
    { name: "Exercises", icon: <Dumbbell className="w-5 h-5" />, count: "15" },
  ];

  const featured = [
    {
      title: "The Science of Sleep",
      category: "Article",
      image: "https://picsum.photos/seed/sleep/400/250",
      time: "5 min read",
    },
    {
      title: "Morning Flow Yoga",
      category: "Video",
      image: "https://picsum.photos/seed/yoga/400/250",
      time: "15 min",
    },
  ];

  const recentResources = [
    {
      title: "Navigating Anxiety in the Workplace",
      category: "Article",
      time: "8 min read",
      seed: "res-0",
    },
    {
      title: "Mindful Eating Habits",
      category: "Video",
      time: "12 min",
      seed: "res-1",
    },
    {
      title: "The Power of Gratitude",
      category: "Podcast",
      time: "20 min",
      seed: "res-2",
    },
  ];

  const filteredResources = recentResources.filter(
    (res) =>
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      {/* Header */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold mb-6">Resources</h2>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for support, articles..."
            className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="grid grid-cols-2 gap-3 mb-10">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => Haptics.light()}
            className="bg-gray-100 p-4 rounded-xl flex items-center gap-3"
          >
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              {cat.icon}
            </div>
            <div>
              <p className="font-bold text-sm">{cat.name}</p>
              <p className="text-xs text-gray-500">{cat.count} items</p>
            </div>
          </button>
        ))}
      </section>

      {/* Featured */}
      {!searchQuery && (
        <section className="mb-10">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-bold">Featured</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map((item, i) => (
              <div
                key={i}
                onClick={() => handleResourceClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow cursor-pointer"
              >
                <img src={item.image} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-blue-500">{item.category}</p>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* List */}
      <section className="space-y-3">
        <h3 className="font-bold mb-4">
          {searchQuery ? `Results (${filteredResources.length})` : "Recent"}
        </h3>

        {filteredResources.length > 0 ? (
          filteredResources.map((res, i) => (
            <button
              key={i}
              onClick={() => handleResourceClick(res)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100"
            >
              <img
                src={`https://picsum.photos/seed/${res.seed}/100/100`}
                className="w-14 h-14 rounded-lg object-cover"
              />

              <div className="flex-1 text-left">
                <p className="font-bold">{res.title}</p>
                <p className="text-sm text-gray-500">
                  {res.category} • {res.time}
                </p>
              </div>

              <ChevronRight />
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500">No results found</p>
        )}
      </section>

      {/* Modal */}
      <Modal
        isOpen={!!selectedResource}
        onClose={() => setSelectedResource(null)}
        title={selectedResource?.category || "Resource"}
      >
        {selectedResource && <ResourceViewer resource={selectedResource} />}
      </Modal>
    </motion.main>
  );
}
