import {
  Settings,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Calendar,
  Activity,
  Award,
  Edit2,
} from "lucide-react";
import { motion } from "motion/react";

export default function ProfilePage() {
  const stats = [
    {
      label: "Days Active",
      value: "12",
      icon: <Calendar className="w-5 h-5" />,
    },
    { label: "Sessions", value: "24", icon: <Activity className="w-5 h-5" /> },
    { label: "Badges", value: "5", icon: <Award className="w-5 h-5" /> },
  ];

  const settings = [
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Account Settings",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      {/* Profile Header */}
      <section className="flex flex-col items-center text-center mb-10">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow">
            <img
              src="https://picsum.photos/seed/user/200/200"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-2xl font-bold">Alex Johnson</h2>
        <p className="text-gray-500 text-sm">Mindfulness Explorer</p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-100 p-4 rounded-xl text-center">
            <div className="text-blue-500 mb-1">{stat.icon}</div>
            <p className="text-lg font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Settings */}
      <section className="mb-10">
        <h3 className="text-sm font-bold text-gray-500 mb-4">Preferences</h3>

        <div className="bg-gray-100 rounded-xl overflow-hidden">
          {settings.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-200"
            >
              <div className={`p-2 rounded-lg ${item.color}`}>{item.icon}</div>

              <span className="flex-1 text-left font-medium">{item.label}</span>

              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <button className="w-full bg-red-100 text-red-600 p-4 rounded-xl flex items-center justify-center gap-2 font-bold">
        <LogOut className="w-5 h-5" />
        Log Out
      </button>

      {/* Version */}
      <p className="text-center text-gray-400 text-xs mt-10">Base44 v1.0.2</p>
    </motion.main>
  );
}
